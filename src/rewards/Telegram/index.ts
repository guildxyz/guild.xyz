import { TelegramLogo } from "@phosphor-icons/react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export default {
  icon: TelegramLogo,
  imageUrl: "/platforms/telegram.png",
  name: "Telegram",
  colorScheme: "TELEGRAM",
  gatedEntity: "group",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
