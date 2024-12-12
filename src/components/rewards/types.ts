import type { GuildReward } from "@/lib/schemas/guildReward";
import type { RoleReward } from "@/lib/schemas/roleReward";

export type RewardCardProps = {
  roleId: string;
  reward: {
    guildReward: GuildReward;
    roleReward: RoleReward;
  };
};
