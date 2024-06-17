import { DiscordLogo } from "phosphor-react"
import useDiscordCardProps from "./useDiscordCardProps"
import DiscordCardSettings from "./DiscordCardSettings"
import DiscordCardMenu from "./DiscordCardMenu"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  DISCORD: {
    icon: DiscordLogo,
    imageUrl: "/platforms/discord.png",
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    cardPropsHook: useDiscordCardProps,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    isPlatform: true,
    ...dynamicComponents,
  },
} as const satisfies Partial<Rewards>
export default rewards
