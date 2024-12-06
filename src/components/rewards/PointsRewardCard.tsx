import { PointsRoleRewardDataSchema } from "@/lib/schemas/roleReward";
import { Star } from "@phosphor-icons/react/dist/ssr";
import type { FunctionComponent } from "react";
import { RewardCard, RewardCardButton } from "./RewardCard";
import type { RewardCardProps } from "./types";

export const PointsRewardCard: FunctionComponent<RewardCardProps> = ({
  reward,
}) => {
  const {
    data: { name },
  } = reward.guildReward;
  const roleRewardData = PointsRoleRewardDataSchema.parse(
    reward.roleReward.data,
  );

  return (
    <RewardCard
      title={`Get ${roleRewardData.amount} ${name || "points"}`}
      description="Guild points"
      image={<Star className="size-4" />}
    >
      <RewardCardButton>Claim points</RewardCardButton>
    </RewardCard>
  );
};
