using System;
using Microsoft.EntityFrameworkCore;

namespace mealhub.Helpers
{
    public class PaginationFilter<T> : List<T>
    {
        public PaginationFilter(IEnumerable<T> items, int count, int offset, int pageSize)
        {
            Offset = offset;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int Offset { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public static async Task<PaginationFilter<T>> CreateAsync(IQueryable<T> source,
         int offset, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source
            .Skip(offset)
            .Take(pageSize)
            .ToListAsync();

            return new PaginationFilter<T>(items, count, offset, pageSize);
        }

    }
}