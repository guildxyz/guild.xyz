"use server";

import { env } from "@/lib/env";
import type { Guild } from "@/lib/schemas/guild";
import type { PaginatedResponse } from "@/lib/types";
import { PAGE_SIZE } from "./constants";
import { fetchGuildApi } from "@/lib/fetchGuildApi";

export const getGuildSearch = async ({
  pageParam,
  search,
}: { pageParam: number; search: string }) => {
  return fetchGuildApi<PaginatedResponse<Guild>>(
    `guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
  );
};
