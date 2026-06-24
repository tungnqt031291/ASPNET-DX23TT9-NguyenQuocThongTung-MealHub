using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mealhub.DTOs.Request;
using mealhub.DTOs.Response;
using mealhub.Extensions;
using mealhub.Interfaces;

namespace mealhub.Controllers
{
    public class LikeController : BaseApiController
    {
        private readonly ILikeRepository _likeRepository;

        public LikeController(ILikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
        }

        [HttpPost]
        public async Task<ActionResult<LikesDto>> LikeRecipe(LikesRequest likesRequest)
        {
            var success = await _likeRepository.LikeRecipe(User.GetUsername(), likesRequest.RecipeId);

            if (success.LikesDto != null)
            {
                return CreatedAtAction(nameof(LikeRecipe), new
                {
                    likeId = success.LikesDto.LikeId
                }, success.LikesDto);
            }
            else
            {
                return success.ErrorCode switch
                {
                    400 => BadRequest(success.ErrorMessage),
                    404 => NotFound(success.ErrorMessage),
                    _ => StatusCode(500, success.ErrorMessage),
                };
            }

        }

        [HttpDelete("{recipeId}")]
        public async Task<ActionResult> UnlikeRecipe(int recipeId)
        {

            var success = await _likeRepository.UnlikeRecipe(User.GetUsername(), recipeId);

            if (success.IsSuccess)
            {
                return NoContent();
            }
            else
            {
                return success.ErrorCode switch
                {
                    400 => BadRequest(success.ErrorMessage),
                    404 => NotFound(success.ErrorMessage),
                    _ => StatusCode(500, success.ErrorMessage),
                };
            }

        }
    }
}