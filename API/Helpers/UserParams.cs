using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.Helpers
{
    public class UserParams : PaginationParams
    {


        public string Category { get; set; } = "all";


        public bool MostRecent { get; set; } = true;
    }
}