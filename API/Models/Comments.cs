using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.Models
{
    [Table("Comments")]
    public class Comments
    {
        [Key]
        public int CommentId { get; set; }

        public int UserId { get; set; }

        public int RecipeId { get; set; }

        [MinLength(1)]
        public string Comment { get; set; }

        public DateTime DateCommented { get; set; } = DateTime.UtcNow;


        [ForeignKey("UserId")]
        public AppUser AppUser { get; set; }

        [ForeignKey("RecipeId")]
        public Recipes Recipe { get; set; }
    }
}