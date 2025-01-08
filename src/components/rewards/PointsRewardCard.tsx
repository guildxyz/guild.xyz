import { useGuildUrlName } from "@/app/(dashboard)/[guildUrlName]/hooks/useGuildUrlName";
import type { GuildReward } from "@/lib/schemas/guildReward";
import { PointsRoleRewardDataSchema } from "@/lib/schemas/roleReward";
import { ArrowRight, Star } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import type { FunctionComponent } from "react";
import { RewardCard, RewardCardButton } from "./RewardCard";
import type { RewardCardProps } from "./types";

export const PointsRewardCard: FunctionComponent<RewardCardProps> = ({
  reward,
}) => {
  const {
    id,
    data: { name },
  } = reward.guildReward as Extract<GuildReward, { type: "POINTS" }>;
  const roleRewardData = PointsRoleRewardDataSchema.parse(
    reward.roleReward.data,
  );

  const router = useRouter();
  const guildUrlName = useGuildUrlName();

  return (
    <RewardCard
      title={`Get ${roleRewardData.amount} ${name || "points"}`}
      description="Guild points"
      image={<Star className="size-4" />}
    >
      <RewardCardButton
        rightIcon={<ArrowRight weight="bold" />}
        onClick={() => router.push(`/${guildUrlName}/leaderboard/${id}`)}
      >
        View leaderboard
      </RewardCardButton>
    </RewardCard>
  );
};
