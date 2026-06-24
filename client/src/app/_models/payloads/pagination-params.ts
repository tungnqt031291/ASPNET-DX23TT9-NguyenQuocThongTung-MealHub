export class PaginationParams {
  offset = 0;
  itemsPerPage = 5;
  mostRecent = true;
  category = 'all';
  container = 'Inbox';

  setCategory(value: string) {
    this.category = value;
  }

  setMostRecent(value: boolean) {
    this.mostRecent = value;
  }

  setOffset(value: number) {
    this.offset = value;
  }

  setItemsPerPage(value: number) {
    this.itemsPerPage = value;
  }

  incrementOffset() {
    this.offset += this.itemsPerPage;
  }

  getOffset() {
    return this.offset;
  }

  getPageSize() {
    return this.itemsPerPage;
  }

  allItemsLoaded(value: number) {
    
    return this.offset + this.itemsPerPage >= value;
  }
}
