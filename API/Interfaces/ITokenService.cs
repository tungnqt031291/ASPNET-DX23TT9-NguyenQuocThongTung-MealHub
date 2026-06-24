using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mealhub.Models;

namespace mealhub.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}