using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.DTOs.Request
{
    public class MessageRequest
    {
        public string ReceiverUsername { get; set; }
        public string Content { get; set; }

    }
}