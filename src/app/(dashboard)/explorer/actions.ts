import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { PaginatedResponse } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { PAGE_SIZE } from "./constants";

export const getGuildSearch = async ({
  pageParam,
  search,
}: { pageParam: number; search: string }) => {
  return fetchGuildApiData<PaginatedResponse<Schemas["Guild"]>>(
    `guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
  );
};
