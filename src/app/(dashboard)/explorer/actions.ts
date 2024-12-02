"use server";
import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { Guild } from "@/lib/schemas/guild";
import type { PaginatedResponse } from "@/lib/types";
import { PAGE_SIZE } from "./constants";

export const getGuildSearch = async ({
  pageParam,
  search,
}: { pageParam: number; search: string }) => {
  return fetchGuildApiData<PaginatedResponse<Guild>>(
    `guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
  );
};
