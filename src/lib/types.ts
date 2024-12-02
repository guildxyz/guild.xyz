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

export type DynamicRoute<T extends Record<string, string>> = {
  params: T;
};

/**
 * Unstable error structure coming from v3 backend
 *
 * @property message most common error response
 * @property error on some endpoints this field is given instead of message
 */
// TODO: align this to backend when error handling gets consistent
export type ErrorLike = {
  message: string;
  status?: string;
  error?: string;
};
