import { TelegramLogo } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useTelegramCardProps from "./useTelegramCardProps"
import TelegramCardMenu from "./TelegramCardMenu"
import dynamicComponents from "./DynamicComponents"

export default {
  icon: TelegramLogo,
  imageUrl: "/platforms/telegram.png",
  name: "Telegram",
  colorScheme: "TELEGRAM",
  gatedEntity: "group",
  cardPropsHook: useTelegramCardProps,
  cardMenuComponent: TelegramCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  isPlatform: true,
  ...dynamicComponents,
} as const as RewardData
