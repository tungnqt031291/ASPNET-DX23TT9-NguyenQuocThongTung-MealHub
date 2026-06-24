
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using mealhub.DTOs.Request;
using mealhub.DTOs.Response;
using mealhub.Extensions;
using mealhub.Helpers;
using mealhub.Interfaces;
using mealhub.Models;

namespace mealhub.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMemberRepository _memberRepository;

        private readonly IMapper _mapper;

        private readonly IHubContext<PresenceHub> _presenceHub;

        public ChatHub(IMessageRepository messageRepository,
         IMemberRepository memberRepository, IMapper mapper,
         IHubContext<PresenceHub> presenceHub)
        {
            _messageRepository = messageRepository;
            _memberRepository = memberRepository;
            _mapper = mapper;
            _presenceHub = presenceHub;
        }

        public async override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await AddToGroup(groupName);

            var messages = await _messageRepository.GetMessageSocket(Context.User.GetUsername(), otherUser, new UserParams());

            var paginationHeader = new PaginationHeader(messages.Offset, messages.PageSize, messages.TotalCount, messages.TotalPages);


            var response = new
            {
                Messages = messages,
                PaginationHeader = paginationHeader
            };

            await Clients.Caller.SendAsync("ReceiveMessageSocket", response);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await RemoveFromChatGroup();

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(MessageRequest messageRequest)
        {
            var username = Context.User.GetUsername();
            if (username == messageRequest.ReceiverUsername.ToLower())
            {
                throw new HubException("You cannot send messages to yourself");
            }

            var sender = await _memberRepository.GetUserByUserNameAsync(username);

            var receiver = await _memberRepository.GetUserByUserNameAsync(messageRequest.ReceiverUsername);

            if (receiver == null) throw new HubException("The user you are trying to message is not found ");

            var message = new Message
            {
                Sender = sender,
                Receiver = receiver,
                SenderUsername = sender.UserName,
                ReceiverUsername = receiver.UserName,
                Content = messageRequest.Content
            };

            var groupName = GetGroupName(sender.UserName, receiver.UserName);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.UserName == receiver.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUser(receiver.UserName);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections)
                    .SendAsync("NewMessageReceived",
                    new { username = sender.UserName, alias = sender.Alias });
                }
            }

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
            else
            {

                throw new HubException("Something went wrong sending the message");
            }

        }

        public async Task LoadMoreMessages(string otherUser, int offset, int pageSize)
        {
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

            var userParams = new UserParams
            {
                Offset = offset,
                PageSize = pageSize
            };

            var messages = await _messageRepository.GetMessageSocket(Context.User.GetUsername(), otherUser, userParams);

            await Clients.Group(groupName).SendAsync("LoadOlderMessages", messages);
        }

        private async Task RemoveFromChatGroup()
        {
            var connection = await _messageRepository.GetConnection(Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);
            await _messageRepository.SaveAllAsync();
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());
            if (group == null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);
            return await _messageRepository.SaveAllAsync();
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;

            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}