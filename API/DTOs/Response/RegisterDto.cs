using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        public string UserName { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        public string Alias { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }

    }
}