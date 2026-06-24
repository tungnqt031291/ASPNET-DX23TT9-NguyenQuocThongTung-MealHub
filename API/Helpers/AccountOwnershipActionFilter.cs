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
    public class AccountOwnershipActionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var authUser = await context.HttpContext.RequestServices.GetService<IMemberRepository>()
                            .GetUserByUserNameAsync(context.HttpContext.User.GetUsername());
            if (authUser == null)
            {
                context.Result = new NotFoundObjectResult("User not found");
                return;
            }
            if (context.ActionArguments.TryGetValue("username", out object usernameValue) && usernameValue is string username)
            {
                if (authUser.UserName != username)
                {
                    context.Result = new UnauthorizedObjectResult("You do not own this account");
                    return;
                }
            }


            await next();

        }
    }
}