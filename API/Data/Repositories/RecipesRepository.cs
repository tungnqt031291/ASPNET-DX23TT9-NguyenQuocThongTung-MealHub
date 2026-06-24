using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mealhub.DTOs;
using mealhub.DTOs.Request;
using mealhub.Helpers;
using mealhub.Interfaces;
using mealhub.Models;

namespace mealhub.Data.Repositories
{

    public class UpdateResult
    {
        public bool Success { get; set; }
        public string Error { get; set; }
    }

    public class AddRecipeResult
    {
        public RecipesDto Recipe { get; set; }
        public bool Success { get; set; }
    }


    public class RecipesRepository : IRecipesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        private readonly IPhotoService _photoService;
        public RecipesRepository(DataContext context, IMapper mapper, IPhotoService photoService)
        {
            _context = context;
            _mapper = mapper;
            _photoService = photoService;
        }

        public Task<RecipesDto> GetRecipeByIdAsync(int id)
        {
            return _context.Recipes.Where(rec => rec.Id == id)
                .Include(rec => rec.Ingredients)
                .Include(rec => rec.Likes)
                .Include(rec => rec.Comments)
                .Include(rec => rec.Photo)
                .Include(rec => rec.AppUser)
                .ThenInclude(u => u.Photo)
                .ProjectTo<RecipesDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PaginationFilter<RecipesDto>> GetRecipesAsync(UserParams userParams)
        {
            var query = _context.Recipes
                    .Include(rec => rec.Ingredients)
                    .Include(rec => rec.Likes)
                    .Include(rec => rec.Comments)
                    .Include(rec => rec.Photo)
                    .Include(rec => rec.AppUser)
                    .ThenInclude(u => u.Photo)
                    .AsQueryable();

            if (userParams.Category != "all")
            {
                query = query.Where(rec => rec.Category.ToLower().Trim().Equals(userParams.Category.ToLower().Trim()));
            }

            if (userParams.MostRecent)
                query = query.OrderByDescending(rec => rec.DateAdded);
            else
                query = query.OrderBy(rec => rec.DateAdded);


            var paginationFilter = await PaginationFilter<RecipesDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<RecipesDto>(_mapper.ConfigurationProvider),
                userParams.Offset, userParams.PageSize);

            return paginationFilter;
        }

        public async Task<AddRecipeResult> AddRecipeAsync(RecipeRequest recipesDto, string username)
        {
            var user = _context.Users
            .Include(u => u.Photo)
            .SingleOrDefault(user => user.UserName == username);

            var newRecipe = _mapper.Map<Recipes>(recipesDto);
            newRecipe.AppUser = user;
            await _context.Recipes.AddAsync(newRecipe);
            if (await SaveAllAsync())
            {
                return new AddRecipeResult { Recipe = _mapper.Map<RecipesDto>(newRecipe), Success = true };

            }

            return new AddRecipeResult
            {
                Recipe = null,
                Success = false
            };

        }


        public async Task<UpdateResult> UpdateRecipe(RecipeRequest recipeUpdateDto, int id)
        {
            var recipe = await _context.Recipes.Include(rec => rec.Ingredients).FirstOrDefaultAsync(x => x.Id == id);
            if (recipe == null)
            {
                return new UpdateResult
                {
                    Success = false,
                    Error = "Not Found"
                };
            }

            _mapper.Map(recipeUpdateDto, recipe);

            if (await SaveAllAsync())
            {
                return new UpdateResult
                {
                    Success = true,
                    Error = ""
                };
            }
            else
            {
                return new UpdateResult
                {
                    Success = false,
                    Error = "Bad Request"
                };
            }

        }


        public async Task<bool> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.Include(rec => rec.Photo).FirstOrDefaultAsync(rec => rec.Id == id);

            if (recipe == null)
            {
                return false;
            }
            if (recipe.Photo?.PublicId?.Length > 0)
            {
                var result = await _photoService.DeletePhotoAsync(recipe.Photo.PublicId);
                if (result.Error != null) return false;
            }
            _context.Recipes.Remove(recipe);

            return await SaveAllAsync();
        }
        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Recipes recipe)
        {
            _context.Entry(recipe).State = EntityState.Modified;
        }

        public async Task<bool> UserHasLikedRecipe(string username, int recipeId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            var userId = user.Id;
            var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.UserId == userId && l.RecipeId == recipeId);

            // If like is not null, the user has liked the recipe; otherwise, they haven't
            return like != null;
        }

        public async Task<Recipes> GetContextRecipeByIdAsync(int id)
        {
            return await _context.Recipes.FindAsync(id);
        }
    }
}