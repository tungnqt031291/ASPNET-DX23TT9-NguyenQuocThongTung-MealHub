using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using mealhub.Extensions;
using mealhub.Interfaces;

namespace mealhub.Helpers
{
    public class RecipeOwnershipActionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var authUser = await context.HttpContext.RequestServices.GetService<IMemberRepository>()
                            .GetUserByUserNameAsync(context.HttpContext.User.GetUsername());

            if (authUser == null)
            {
                context.Result = new UnauthorizedObjectResult("Uknown user!");
                return;
            }

            if (context.ActionArguments.TryGetValue("id", out object idValue) && idValue is int recipeId)
            {
                var recipeRep = context.HttpContext.RequestServices.GetRequiredService<IRecipesRepository>();

                var recipe = await recipeRep.GetRecipeByIdAsync(recipeId);

                if (recipe == null)
                {
                    context.Result = new NotFoundObjectResult("Recipe not Found");
                    return;
                }

                if (recipe.AppUserName != authUser.UserName)
                {
                    context.Result = new UnauthorizedObjectResult("You do not own this recipe!");
                    return;
                }

            }
            else
            {
                context.Result = new BadRequestResult();
                return;
            }

            await next();
        }
    }
}