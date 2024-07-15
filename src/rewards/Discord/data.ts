import { PiDiscordLogo } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const discordData = {
  icon: PiDiscordLogo,
  imageUrl: "/platforms/discord.png",
  name: "Discord",
  colorScheme: "DISCORD",
  gatedEntity: "server",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
} satisfies RewardData
