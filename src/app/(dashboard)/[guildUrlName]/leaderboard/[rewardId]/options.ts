import { fetchLeaderboard } from "@/app/(dashboard)/explorer/fetchers";
import { infiniteQueryOptions } from "@tanstack/react-query";

export const leaderboardOptions = ({ rewardId }: { rewardId: string }) => {
  return infiniteQueryOptions({
    queryKey: ["leaderboard", rewardId],
    queryFn: ({ pageParam }) =>
      fetchLeaderboard({ rewardId, offset: pageParam }),
    initialPageParam: 1,
    enabled: rewardId !== undefined,
    getNextPageParam: (lastPage) =>
      lastPage.total / lastPage.limit <= lastPage.offset
        ? undefined
        : lastPage.offset + 1,
  });
};
