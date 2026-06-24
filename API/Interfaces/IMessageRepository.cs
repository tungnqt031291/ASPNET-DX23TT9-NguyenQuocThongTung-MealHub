using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mealhub.DTOs;
using mealhub.DTOs.Response;
using mealhub.Helpers;
using mealhub.Models;

namespace mealhub.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);

        void DeleteMessage(Message message);

        Task<Message> GetMessage(int messageId);

        Task<IEnumerable<MemberDto>> GetMessagingUsers(string currentUserName);

        Task<PaginationFilter<MessageDto>> GetMessagesForUser(MessageParams messageParams);

        Task<PaginationFilter<MessageDto>> GetMessageSocket(string currentUserName, string receiverUserName, UserParams userParams);

        void AddGroup(Group group);

        void RemoveConnection(Connection connection);

        Task<Connection> GetConnection(string connectionId);

        Task<Group> GetMessageGroup(string groupName);

        Task<List<string>> GetConnectionsForGroup(string groupName);

        Task<bool> SaveAllAsync();
    }

}