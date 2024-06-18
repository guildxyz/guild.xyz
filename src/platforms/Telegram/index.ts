import { TelegramLogo } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import useTelegramCardProps from "./useTelegramCardProps"
import TelegramCardMenu from "./TelegramCardMenu"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  TELEGRAM: {
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
  },
} as const as Partial<Rewards>

export default rewards
