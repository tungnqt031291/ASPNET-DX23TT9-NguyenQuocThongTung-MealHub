using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mealhub.Data.Repositories;
using mealhub.DTOs.Request;
using mealhub.DTOs.Response;
using mealhub.Models;

namespace mealhub.Interfaces
{
    public interface ILikeRepository
    {
        Task<LikeResult> LikeRecipe(string username, int recipeId);
        Task<LikeResult> UnlikeRecipe(string username, int recipeId);

        Task<bool> SaveAllAsync();
    }
}