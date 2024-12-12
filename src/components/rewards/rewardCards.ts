import type { GuildRewardType } from "@/lib/schemas/guildReward";
import type { FunctionComponent } from "react";
import { DiscordRewardCard } from "./DiscordRewardCard";
import { GuildPermissionRewardCard } from "./GuildPermissionRewardCard";
import { PointsRewardCard } from "./PointsRewardCard";
import type { RewardCardProps } from "./types";

export const rewardCards = {
  GUILD: GuildPermissionRewardCard,
  POINTS: PointsRewardCard,
  DISCORD: DiscordRewardCard,
} as const satisfies Record<
  Exclude<GuildRewardType, "FORM" | "TELEGRAM">,
  FunctionComponent<RewardCardProps>
>;
