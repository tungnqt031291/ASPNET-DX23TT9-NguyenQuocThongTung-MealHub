using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.DTOs.Request
{
    public class PhotoRequest
    {
        public IFormFile File;

        public string Context { get; set; }
    }
}