import type { GuildReward } from "@/lib/schemas/guildReward";
import { PointsRoleRewardDataSchema } from "@/lib/schemas/roleReward";
import { ArrowRight, Star } from "@phosphor-icons/react/dist/ssr";
import { usePathname, useRouter } from "next/navigation";
import type { FunctionComponent } from "react";
import { RewardCard, RewardCardButton } from "./RewardCard";
import type { RewardCardProps } from "./types";

export const PointsRewardCard: FunctionComponent<RewardCardProps> = ({
  reward,
}) => {
  const {
    id,
    data: { name },
  } = reward.guildReward as Extract<GuildReward, { type: "POINTS" }>; // Should we use Zod here?
  const roleRewardData = PointsRoleRewardDataSchema.parse(
    reward.roleReward.data,
  );

  // We should think about this... I'm pretty sure we shouldn't use pathname here
  const pathname = usePathname();
  const router = useRouter();

  return (
    <RewardCard
      title={`Get ${roleRewardData.amount} ${name || "points"}`}
      description="Guild points"
      image={<Star className="size-4" />}
    >
      <RewardCardButton
        rightIcon={<ArrowRight weight="bold" />}
        onClick={() => router.push(`${pathname}/leaderboard/${id}`)}
      >
        View leaderboard
      </RewardCardButton>
    </RewardCard>
  );
};
