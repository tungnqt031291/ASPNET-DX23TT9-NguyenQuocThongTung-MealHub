using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.DTOs.Request
{
    public class CommentRequest
    {
        public int CommentId { get; set; }
        public int RecipeId { get; set; }

        public string UserName { get; set; }

        public string Comment { get; set; }

        public DateTime DateCommented { get; set; }
    }
}