"use client";

import { useUser } from "@/hooks/useUser";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSuspensePointReward } from "../hooks/useSuspensePointReward";
import { leaderboardOptions } from "../options";
import { LeaderboardUserCard } from "./LeaderboardUserCard";

export const Leaderboard = () => {
  const { data: user } = useUser();

  const { rewardId } = useParams<{ rewardId: string }>();
  const { data: rawData } = useSuspenseInfiniteQuery(
    leaderboardOptions({ rewardId, userId: user?.id }),
  );

  const { data: pointReward } = useSuspensePointReward();

  const data = rawData?.pages[0];

  return (
    <div className="space-y-6">
      {!!data.user && (
        <section className="space-y-4">
          <h2 className="font-bold">Your position</h2>
          <LeaderboardUserCard user={data.user} />
        </section>
      )}

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
