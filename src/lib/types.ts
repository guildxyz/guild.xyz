import type { Schemas } from "@guildxyz/types";

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
  data: {
    message: string;
    status?: string;
    error?: string;
  };
  partialResponse: {
    status: number;
  };
};

/**
 * Loose type for describing either a
 * - `urlName`: uri safe identifier alias
 * - `id`: uuid v4 identifier
 */
export type WithIdLike<E extends Entity> = {
  [key in `${E}IdLike`]: string;
};

export type WithId<E extends Entity> = {
  [key in `${E}Id`]: string;
};

// TODO: move to @guildxyz/types
export type Entity = "guild" | "role" | "page" | "user" | "reward";

export type EntitySchema<T extends Entity> = Schemas[Capitalize<T>];
