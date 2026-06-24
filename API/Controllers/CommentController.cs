using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mealhub.Data;
using mealhub.DTOs.Request;
using mealhub.DTOs.Response;
using mealhub.Extensions;
using mealhub.Models;

namespace mealhub.Controllers
{
    [Authorize]
    public class CommentController : BaseApiController
    {
        private readonly DataContext _context;
        public CommentController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<CommentDto>> PostComment(CommentRequest commentRequest)
        {
            var userNameToken = User.GetUsername();
            if (!userNameToken.Equals(commentRequest.UserName)) return BadRequest("Username logged in and user commented don't match");

            var user = await _context.Users
            .Include(u => u.Photo)
            .SingleOrDefaultAsync(u => u.UserName == userNameToken);

            if (user == null) return NotFound("User not Found!");

            var recipe = await _context.Recipes
            .SingleOrDefaultAsync(r => r.Id == commentRequest.RecipeId);

            if (recipe == null) return NotFound("Recipe not Found");

            var newComment = new Comments
            {
                UserId = user.Id,
                RecipeId = recipe.Id,
                Comment = commentRequest.Comment,
                DateCommented = commentRequest.DateCommented
            };

            await _context.Comments.AddAsync(newComment);

            if (await _context.SaveChangesAsync() > 0)
            {
                var commentDto = new CommentDto
                {
                    UserName = userNameToken,
                    UserPhotoUrl = user.Photo?.Url,
                    UserId = user.Id,
                    Comment = commentRequest.Comment,
                    DateCommented = commentRequest.DateCommented,
                    CommentId = newComment.CommentId
                };

                return Ok(commentDto);
            }

            return BadRequest("Something went wrong!");

        }


        [HttpDelete]
        public async Task<ActionResult> DeleteComment(string username, int recipeId, int commentId)
        {
            //Only a user that owns the comment or the User that owns the Recipe the comment
            // was made on can delete the comment

            var tokenUsername = User.GetUsername();

            var tokenUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == tokenUsername);

            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if (tokenUser != user) return Unauthorized("You are not the user that send the request!");

            if (user == null) return NotFound("User not found");

            var recipe = await _context.Recipes.SingleOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null) return NotFound("Recipe not found");

            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.CommentId == commentId);

            if (comment == null) return BadRequest("This is not the Comment you are Looking for!");


            if (comment.UserId == tokenUser.Id || recipe.AppUserId == tokenUser.Id)
            {

                _context.Comments.Remove(comment);

            }
            else
            {
                return Unauthorized("You are not authorized to delete this comment");
            }


            if (await _context.SaveChangesAsync() > 0)
            {
                return NoContent();
            }
            return BadRequest("Something went wrong deleting this comment");


        }
    }
}