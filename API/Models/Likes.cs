using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mealhub.Models
{
    [Table("Likes")]
    public class Likes
    {
        [Key]
        public int LikeId { get; set; }

        public int UserId { get; set; }
        public int RecipeId { get; set; }

        [ForeignKey("UserId")]
        public AppUser AppUser { get; set; }

        [ForeignKey("RecipeId")]
        public Recipes Recipe { get; set; }

    }
}