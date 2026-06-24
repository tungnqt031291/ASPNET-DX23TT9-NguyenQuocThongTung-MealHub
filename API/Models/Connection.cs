using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.Models
{
    public class Connection
    {
        public Connection()
        {
        }
        public Connection(string connectionId, string username)
        {
            this.ConnectionId = connectionId;
            this.UserName = username;

        }
        public string ConnectionId { get; set; }
        public string UserName { get; set; }

    }
}