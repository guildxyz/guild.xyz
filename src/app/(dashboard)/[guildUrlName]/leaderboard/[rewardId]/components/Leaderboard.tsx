"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { leaderboardOptions, pointsRewardOptions } from "../options";
import { LeaderboardUserCard } from "./LeaderboardUserCard";

export const Leaderboard = ({ rewardId }: { rewardId: string }) => {
  const { data: rawData } = useSuspenseInfiniteQuery(
    leaderboardOptions({ rewardId }),
  );

  const { data: pointReward } = useSuspenseQuery(
    pointsRewardOptions({ rewardId }),
  );

  const data = rawData?.pages[0];

  return (
    <div className="space-y-6">
      {/* <section className="space-y-4">
        <h2 className="font-bold">Your position</h2>
        <LeaderboardUserCard user={data.user} />
      </section> */}

      <section className="space-y-4">
        <h2 className="font-bold">{`${pointReward.data.name} leaderboard`}</h2>
        {data.leaderboard.map((user, index) => (
          <LeaderboardUserCard
            key={user.userId}
            user={{
              ...user,
              rank: index + 1,
            }}
          />
        ))}
      </section>
    </div>
  );
};
