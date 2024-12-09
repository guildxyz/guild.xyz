"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { leaderboardOptions } from "../options";
import { LeaderboardUserCard } from "./LeaderboardUserCard";

export const Leaderboard = ({ rewardId }: { rewardId: string }) => {
  const { data: rawData } = useInfiniteQuery(leaderboardOptions({ rewardId }));

  const data = rawData?.pages[0];

  // TODO: use useSuspenseQuery & render proper skeleton loaders
  if (!data) return <>Loading...</>;

  return (
    <div className="space-y-6">
      {/* <section className="space-y-4">
        <h2 className="font-bold">Your position</h2>
        <LeaderboardUserCard user={data.user} />
      </section> */}

      <section className="space-y-4">
        {/* TODO: display points' name */}
        <h2 className="font-bold">Leaderboard</h2>
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
