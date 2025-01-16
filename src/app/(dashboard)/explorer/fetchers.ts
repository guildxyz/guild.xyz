import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { Leaderboard } from "@/lib/schemas/leaderboard";
import type { PaginatedResponse } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { PAGE_SIZE } from "./constants";

export const fetchAssociatedGuilds = async (userId: string) => {
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

export const LEADERBOARD_LIMIT = 5;
export const fetchLeaderboard = async ({
  rewardId,
  userId,
  offset = 0,
}: { rewardId: string; userId?: string; offset?: number }) => {
  return fetchGuildApiData<
    Leaderboard & { total: number; offset: number; limit: number }
  >(`reward/${rewardId}/leaderboard?userId=${userId}&limit=${LEADERBOARD_LIMIT}&offset=${offset}
`);
};
