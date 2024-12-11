import { DiscordRewardCard } from "./DiscordRewardCard";
import { GuildPermissionRewardCard } from "./GuildPermissionRewardCard";
import { PointsRewardCard } from "./PointsRewardCard";

export const rewardCards = {
  GUILD: GuildPermissionRewardCard,
  POINTS: PointsRewardCard,
  DISCORD: DiscordRewardCard,
} as const; // TODO: add "satisfies..."
