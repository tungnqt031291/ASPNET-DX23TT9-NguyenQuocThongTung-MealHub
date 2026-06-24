
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mealhub.Models
{

    [Table("Recipes")]
    public class Recipes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        public Photo Photo { get; set; }

        public string PreparationSteps { get; set; } = null!;

        public string Category { get; set; } = null!;

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public List<Likes> Likes { get; set; } = new();

        public List<Comments> Comments { get; set; } = new();
        public List<Ingredient> Ingredients { get; set; } = new();

        [ForeignKey("AppUserId")]
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }


    }
}