export type PaginatedResponse<Item = unknown> = {
  page: number;
  pageSize: number;
  sortBy: string;
  reverse: boolean;
  searchQuery: string;
  query: string;
  items: Item[];
  total: number;
};
