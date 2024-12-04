import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import { tryGetParsedToken } from "@/lib/token";
import type { PaginatedResponse } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { PAGE_SIZE } from "./constants";

export const fetchAssociatedGuilds = async () => {
  const { userId } = await tryGetParsedToken();
  return fetchGuildApiData<PaginatedResponse<Schemas["Guild"]>>(
    `guild/search?page=1&pageSize=${Number.MAX_SAFE_INTEGER}&sortBy=name&reverse=false&customQuery=@owner:{${userId}}`,
  );
};

export const fetchGuildSearch = async ({
  pageParam,
  search,
}: { pageParam: number; search: string }) => {
  return fetchGuildApiData<PaginatedResponse<Schemas["Guild"]>>(
    `guild/search?page=${pageParam}&pageSize=${PAGE_SIZE}&search=${search}`,
  );
};
