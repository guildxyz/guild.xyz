import { Wrench } from "@phosphor-icons/react/dist/ssr";
import type { FunctionComponent } from "react";
import { RewardCard } from "./RewardCard";
import type { RewardCardProps } from "./types";

export const GuildPermissionRewardCard: FunctionComponent<RewardCardProps> = ({
  reward,
}) => (
  <RewardCard
    title={reward.guildReward.data.name ?? "Unknown permission"}
    description="Guild permission"
    image={<Wrench className="size-4" />}
  />
);
