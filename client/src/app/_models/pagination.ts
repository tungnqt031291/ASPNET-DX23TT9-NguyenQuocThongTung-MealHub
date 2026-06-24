export interface Pagination {
  offset: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginationResults<T> {
  result?: T;
  pagination?: Pagination;
}
