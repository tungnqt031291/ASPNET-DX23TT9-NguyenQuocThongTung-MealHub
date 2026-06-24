using System;
using Microsoft.AspNetCore.Mvc;
using mealhub.Data.Repositories;
using mealhub.DTOs;
using mealhub.DTOs.Request;
using mealhub.Helpers;
using mealhub.Models;

namespace mealhub.Interfaces
{
    public interface IRecipesRepository
    {
        void Update(Recipes recipe);

        Task<bool> UserHasLikedRecipe(string username, int recipeId);
        Task<bool> SaveAllAsync();

        Task<PaginationFilter<RecipesDto>> GetRecipesAsync(UserParams userParams);

        Task<RecipesDto> GetRecipeByIdAsync(int id);

        Task<Recipes> GetContextRecipeByIdAsync(int id);
        Task<AddRecipeResult> AddRecipeAsync(RecipeRequest recipesDto, string username);

        Task<UpdateResult> UpdateRecipe(RecipeRequest recipeUpdateDto, int id);

        Task<bool> DeleteRecipe(int id);


    }
}