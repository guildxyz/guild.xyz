import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { pointsRewardOptions } from "../options";

export const useSuspensePointReward = () => {
  const { rewardId } = useParams<{ rewardId: string }>();
  return useSuspenseQuery(pointsRewardOptions({ rewardId }));
};
