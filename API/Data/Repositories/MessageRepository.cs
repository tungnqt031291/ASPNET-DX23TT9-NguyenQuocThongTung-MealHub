using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using mealhub.DTOs;
using mealhub.DTOs.Response;
using mealhub.Helpers;
using mealhub.Interfaces;
using mealhub.Models;

namespace mealhub.Data.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        public readonly DataContext _context;
        public readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int messageId)
        {
            return await _context.Messages.FindAsync(messageId);
        }

        public async Task<PaginationFilter<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                        .OrderByDescending(m => m.DateSend)
                        .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.ReceiverUsername == messageParams.Username),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),
                _ => query.Where(u => u.ReceiverUsername == messageParams.Username && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PaginationFilter<MessageDto>.CreateAsync(messages, messageParams.Offset, messageParams.PageSize);
        }

        public async Task<IEnumerable<MemberDto>> GetMessagingUsers(string currentUserName)
        {
            var senders = await _context.Messages
                .Where(m => m.ReceiverUsername == currentUserName)
                .Include(u => u.Sender.Photo)
                .Select(m => m.Sender)
                .ToListAsync();

            var receivers = await _context.Messages
                .Where(m => m.SenderUsername == currentUserName)
                .Include(u => u.Receiver.Photo)
                .Select(m => m.Receiver)
                .ToListAsync();

            var query = senders.Union(receivers).Distinct();


            return _mapper.Map<IEnumerable<MemberDto>>(query);

        }



        public async Task<PaginationFilter<MessageDto>> GetMessageSocket(string currentUserName, string receiverUserName, UserParams userParams)
        {
            var query = _context.Messages
            .Include(m => m.Sender)
            .ThenInclude(s => s.Photo)
            .Include(m => m.Receiver)
            .ThenInclude(r => r.Photo)
            .Where(
                m => m.ReceiverUsername == currentUserName &&
                m.ReceiverDeleted == false &&
                m.SenderUsername == receiverUserName ||
                (m.ReceiverUsername == receiverUserName &&
                m.SenderUsername == currentUserName &&
                m.SenderDeleted == false)
                )
            .OrderByDescending(m => m.DateSend)
            .AsQueryable();

            var unreadMessages = query
            .Where(m => m.DateRead == null && m.ReceiverUsername == currentUserName)
            .ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PaginationFilter<MessageDto>.CreateAsync(messages, userParams.Offset, userParams.PageSize);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);

        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups.Include(x => x.Connections)
            .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<List<string>> GetConnectionsForGroup(string groupName)
        {
            var group = await _context.Groups.Include(x => x.Connections)
            .FirstOrDefaultAsync(x => x.Name == groupName);

            if (group == null) return null;
            
            var connectionIds = group.Connections.Select(connection => connection.ConnectionId).ToList();


            return connectionIds;
        }
    }
}