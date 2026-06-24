using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using mealhub.DTOs;
using mealhub.DTOs.Request;
using mealhub.DTOs.Response;
using mealhub.Extensions;
using mealhub.Helpers;
using mealhub.Interfaces;
using mealhub.Models;

namespace mealhub.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IMapper _mapper;

        public MessagesController(IMemberRepository memberRepository,
        IMessageRepository messageRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _memberRepository = memberRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(MessageRequest messageRequest)
        {
            var username = User.GetUsername();
            if (username == messageRequest.ReceiverUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

            var sender = await _memberRepository.GetUserByUserNameAsync(username);

            var receiver = await _memberRepository.GetUserByUserNameAsync(messageRequest.ReceiverUsername);

            if (receiver == null) return NotFound("The user you are trying to message is not found ");

            var message = new Message
            {
                Sender = sender,
                Receiver = receiver,
                SenderUsername = sender.UserName,
                ReceiverUsername = receiver.UserName,
                Content = messageRequest.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(CreateMessage), new
                {
                    messageId = message.MessageId
                }, _mapper.Map<MessageDto>(message));
            }

            return BadRequest("Something went wrong saving the message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginationFilter<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(
                new PaginationHeader(messages.Offset,
                 messages.PageSize, messages.TotalCount, messages.TotalPages));

            return messages;
        }

        [HttpGet("get-users")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMessagingUsers()
        {
            var messages = await _messageRepository.GetMessagingUsers(User.GetUsername());

            return Ok(messages);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await _messageRepository.GetMessage(id);

            if (message.SenderUsername != username && message.ReceiverUsername != username)
                return Unauthorized("You are not authorized to delete this message");

            // if (message.SenderUsername == username) message.SenderDeleted = true;

            // if (message.ReceiverUsername == username) message.ReceiverDeleted = true;

            // if (message.SenderDeleted && message.ReceiverDeleted)
            // {
            // }
            _messageRepository.DeleteMessage(message);

            if (await _memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Something went wrong deleting the message");
        }

        [HttpGet("socket/{username}")]
        public async Task<ActionResult<PaginationFilter<MessageDto>>> GetMessageSocket(string username, [FromQuery] UserParams userParams)
        {
            var currentUserName = User.GetUsername();
            var messages = await _messageRepository.GetMessageSocket(currentUserName, username, userParams);
            Response.AddPaginationHeader(
                new PaginationHeader(messages.Offset,
                 messages.PageSize, messages.TotalCount, messages.TotalPages));
            return Ok(messages);
        }
    }
}