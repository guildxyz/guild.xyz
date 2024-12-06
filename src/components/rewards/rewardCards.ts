import { GuildPermissionRewardCard } from "./GuildPermissionRewardCard";
import { PointsRewardCard } from "./PointsRewardCard";

export const rewardCards = {
  GUILD: GuildPermissionRewardCard,
  POINTS: PointsRewardCard,
} as const;
