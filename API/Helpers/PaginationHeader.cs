using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mealhub.Helpers
{
    public class PaginationHeader
    {
        public PaginationHeader(int offset, int itemsPerPage, int totalItems, int totalPages)
        {
            Offset = offset;
            ItemsPerPage = itemsPerPage;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }

        public int Offset { get; set; }

        public int ItemsPerPage { get; set; }

        public int TotalItems { get; set; }

        public int TotalPages { get; set; }
    }
}