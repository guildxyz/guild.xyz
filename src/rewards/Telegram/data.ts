import { PiTelegramLogo } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const telegramData = {
  icon: PiTelegramLogo,
  imageUrl: "/platforms/telegram.png",
  name: "Telegram",
  colorScheme: "TELEGRAM",
  gatedEntity: "group",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
