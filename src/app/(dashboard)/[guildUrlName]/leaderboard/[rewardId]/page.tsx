import { getQueryClient } from "@/lib/getQueryClient";
import type { DynamicRoute } from "@/lib/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { Leaderboard } from "./components/Leaderboard";
import { leaderboardOptions, pointsRewardOptions } from "./options";

const LeaderboardPage = async ({
  params,
}: DynamicRoute<{ guildUrlName: string; rewardId: string }>) => {
  const { rewardId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(leaderboardOptions({ rewardId }));
  await queryClient.prefetchQuery(pointsRewardOptions({ rewardId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <Leaderboard rewardId={rewardId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default LeaderboardPage;
