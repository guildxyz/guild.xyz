import {
  LEADERBOARD_LIMIT,
  fetchLeaderboard,
} from "@/app/(dashboard)/explorer/fetchers";
import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { GuildReward } from "@/lib/schemas/guildReward";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

export const leaderboardOptions = ({
  rewardId,
  userId,
}: { rewardId: string; userId?: string }) => {
  return infiniteQueryOptions({
    queryKey: ["leaderboard", rewardId],
    queryFn: ({ pageParam }) =>
      fetchLeaderboard({ rewardId, userId, offset: pageParam }),
    initialPageParam: 0,
    enabled: rewardId !== undefined,
    staleTime: 60 * 1000,
    getNextPageParam: (lastPage) => {
      return lastPage.offset + lastPage.limit < lastPage.total
        ? lastPage.offset + LEADERBOARD_LIMIT
        : undefined;
    },
  });
};

export const pointsRewardOptions = ({ rewardId }: { rewardId: string }) => {
  return queryOptions({
    queryKey: ["reward", "id", rewardId],
    queryFn: () =>
      fetchGuildApiData<Extract<GuildReward, { type: "POINTS" }>>(
        `reward/id/${rewardId}`,
      ),
    enabled: !!rewardId,
  });
};
