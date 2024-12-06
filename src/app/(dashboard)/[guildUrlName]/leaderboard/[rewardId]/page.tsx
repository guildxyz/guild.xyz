import { getQueryClient } from "@/lib/getQueryClient";
import type { DynamicRoute } from "@/lib/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Leaderboard } from "./components/Leaderboard";
import { leaderboardOptions } from "./options";

const LeaderboardPage = async ({
  params,
}: DynamicRoute<{ guildUrlName: string; rewardId: string }>) => {
  const { rewardId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(leaderboardOptions({ rewardId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Leaderboard rewardId={rewardId} />
    </HydrationBoundary>
  );
};

export default LeaderboardPage;
