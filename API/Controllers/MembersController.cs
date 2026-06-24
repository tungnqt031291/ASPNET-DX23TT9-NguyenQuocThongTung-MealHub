using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mealhub.DTOs;
using mealhub.DTOs.Request;
using mealhub.Extensions;
using mealhub.Helpers;
using mealhub.Interfaces;
using mealhub.Models;

namespace mealhub.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {

        private readonly IMemberRepository _memberRep;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public MembersController(IMemberRepository memberRep, IMapper mapper, IPhotoService photoService)
        {
            _memberRep = memberRep;
            _photoService = photoService;
            _mapper = mapper;
        }

        [HttpGet("search/{query}")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> SearchMembers(string query)
        {
            var members = await _memberRep.SearchMembers(query);
            return Ok(members);
        }

        [HttpGet("{username}/recipes")]
        public async Task<ActionResult<IEnumerable<RecipesDto>>> GetUserRecipes(string username)
        {
            return Ok(await _memberRep.GetUserRecipesAsync(username));
        }

        [HttpGet("list")]
        public async Task<ActionResult<MemberDto>> GetMembers()
        {
            return Ok(await _memberRep.GetMembersAsync());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetMemberByUserName(string username)
        {
            return Ok(await _memberRep.GetMemberByUserNameAsync(username));
        }

        [ServiceFilter(typeof(AccountOwnershipActionFilter))]
        [HttpGet("{username}/edit")]
        public async Task<ActionResult<MemberDto>> GetMemberByUserNameToEdit(string username)
        {
            return Ok(await _memberRep.GetMemberByUserNameAsync(username));
        }

        [ServiceFilter(typeof(AccountOwnershipActionFilter))]
        [HttpPut("{username}")]
        public async Task<ActionResult> UpdateMemberByUsername(MemberUpdateRequest memberDto, string username)
        {
            var result = await _memberRep.UpdateMemberAsync(memberDto, username);
            if (result == false)
            {
                return NotFound("user not found");
            }
            return NoContent();
        }

        [ServiceFilter(typeof(AccountOwnershipActionFilter))]
        [HttpDelete("{username}")]
        public async Task<ActionResult> DeleteMember(string username)
        {
            var result = await _memberRep.DeleteMemberAsync(username);
            if (result == false)
            {
                return NotFound("User not Found");
            }

            return NoContent();
        }

        [ServiceFilter(typeof(AccountOwnershipActionFilter))]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhotoAsync(IFormFile file)
        {
            var user = await _memberRep.GetUserByUserNameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file, "members");

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = true
            };

            if (user.Photo != null)
            {
                if (user.Photo.PublicId.Length > 0)
                {

                    var deletionResult = await _photoService.DeletePhotoAsync(user.Photo.PublicId);
                    if (deletionResult.Error != null) return BadRequest("There was an error updating your Photo");
                }
            }
            user.Photo = photo;

            if (await _memberRep.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetMemberByUserName), new
                {
                    username = User.GetUsername()
                }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Something went wrong saving new User Photo");
        }



    }
}