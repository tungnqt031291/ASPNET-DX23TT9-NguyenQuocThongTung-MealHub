using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.DTOs.Response
{
    public class CommentDto
    {
        public int CommentId { get; set; }

        public int UserId { get; set; }

        public string Comment { get; set; }

        public string UserName { get; set; }

        public string UserPhotoUrl { get; set; }

        public DateTime DateCommented { get; set; }
    }
}