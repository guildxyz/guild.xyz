import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { Leaderboard } from "@/lib/schemas/leaderboard";
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

export const fetchLeaderboard = async ({
  rewardId,
  offset = 0,
}: { rewardId: string; offset?: number }) => {
  console.log("fetching leaderboard", `reward/${rewardId}/leaderboard`);
  return fetchGuildApiData<
    Leaderboard & { total: number; offset: number; limit: number }
  >(`reward/${rewardId}/leaderboard`); // TODO: use the offset param
};
