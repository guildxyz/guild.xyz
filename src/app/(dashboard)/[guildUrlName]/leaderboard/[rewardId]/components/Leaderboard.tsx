"use client";

import { useInfiniteQueryWithIntersection } from "@/hooks/useInfiniteQueryWithIntersection";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useSuspensePointReward } from "../hooks/useSuspensePointReward";
import { leaderboardOptions } from "../options";
import { LeaderboardUserCard } from "./LeaderboardUserCard";

export const Leaderboard = () => {
  const { data: user } = useUser();

  const { rewardId } = useParams<{ rewardId: string }>();

  const {
    setIntersection,
    infiniteQuery: { data: infiniteData },
  } = useInfiniteQueryWithIntersection({
    infiniteQueryOptions: leaderboardOptions({ rewardId, userId: user?.id }),
  });

  const { data: pointReward } = useSuspensePointReward();

  const data = {
    user: infiniteData?.pages[0].user,
    leaderboard: infiniteData?.pages.flatMap((page) => page.leaderboard),
  };

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
        {data.leaderboard?.map((user, index) => (
          <LeaderboardUserCard
            key={user.userId}
            user={{
              ...user,
              rank: index + 1,
            }}
          />
        ))}
      </section>

      <div
        ref={useCallback(
          (element: HTMLDivElement | null) => {
            setIntersection(element);
          },
          [setIntersection],
        )}
        aria-hidden
        style={{
          width: "100%",
          height: "50px",
          background: "red",
        }}
      />
    </div>
  );
};
