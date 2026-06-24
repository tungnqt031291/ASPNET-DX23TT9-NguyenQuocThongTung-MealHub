using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.DTOs.Request
{
    public class RecipeRequest
    {
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string PreparationSteps { get; set; } = null!;

        public string Category { get; set; } = null!;

        public List<IngredientDto> Ingredients { get; set; } = new();

    }
}