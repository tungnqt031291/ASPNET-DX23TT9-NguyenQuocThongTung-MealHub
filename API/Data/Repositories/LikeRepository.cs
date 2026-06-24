using Microsoft.EntityFrameworkCore;
using mealhub.DTOs.Response;
using mealhub.Interfaces;
using mealhub.Models;

namespace mealhub.Data.Repositories
{
    public class LikeResult
    {
        public LikesDto LikesDto { get; set; }
        public string ErrorMessage { get; set; }

        public int ErrorCode { get; set; }
        public bool IsSuccess => string.IsNullOrEmpty(ErrorMessage);
    }

    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext _context;
        private readonly IMemberRepository _memberRepository;

        private readonly IRecipesRepository _recipesRepository;

        public LikeRepository(DataContext context, IMemberRepository memberRepository, IRecipesRepository recipesRepository)
        {
            _context = context;
            _memberRepository = memberRepository;
            _recipesRepository = recipesRepository;
        }

        public async Task<LikeResult> LikeRecipe(string username, int recipeId)
        {
            var user = await _memberRepository.GetUserByUserNameAsync(username);
            if (user == null) return new LikeResult
            {
                ErrorMessage = "User Not Found",
                ErrorCode = 404
            };

            var recipe = await _recipesRepository.GetRecipeByIdAsync(recipeId);

            if (recipe == null) return new LikeResult
            {
                ErrorMessage = "Recipe Not Found",
                ErrorCode = 404
            };
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.UserId == user.Id & l.RecipeId == recipe.Id);

            if (like != null) return new LikeResult
            {
                ErrorMessage = "Like already exists!",
                ErrorCode = 400
            };

            var newLike = new Likes
            {
                UserId = user.Id,
                RecipeId = recipe.Id
            };
            await _context.Likes.AddAsync(newLike);
            if (await SaveAllAsync())
            {
                return new LikeResult
                {
                    LikesDto = new LikesDto
                    {
                        UserId = user.Id,
                        UserName = user.UserName,
                        UserPhotoUrl = user.Photo?.Url,
                        LikeId = newLike.LikeId,
                    }
                };
            }
            else
            {
                return new LikeResult
                {
                    ErrorCode = 400,
                    ErrorMessage = "Something went wrong with liking the recipe"
                };
            }

        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<LikeResult> UnlikeRecipe(string username, int recipeId)
        {
            var user = await _memberRepository.GetUserByUserNameAsync(username);
            if (user == null) return new LikeResult
            {
                ErrorMessage = "User Not Found",
                ErrorCode = 404
            };

            var recipe = await _context.Recipes.FindAsync(recipeId);

            if (recipe == null) return new LikeResult
            {
                ErrorMessage = "Recipe Not Found",
                ErrorCode = 404
            };
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.UserId == user.Id & l.RecipeId == recipe.Id);

            if (like == null) return new LikeResult
            {
                ErrorMessage = "You cannot unlike something that doesn't exist",
                ErrorCode = 400
            };
            _context.Likes.Remove(like);

            if (await SaveAllAsync())
            {
                return new LikeResult
                {
                };
            }

            return new LikeResult
            {
                ErrorCode = 400,
                ErrorMessage = "Something went wrong unliking the recipe"
            };

        }

    }
}