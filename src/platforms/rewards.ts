import twitterRewards from "platforms/Twitter"
import emailRewards from "platforms/Email"
import telegramRewards from "platforms/Telegram"
import tokenRewards from "platforms/Token"
import gatherTownRewards from "platforms/Gather"
import formRewards from "platforms/Forms"
import pointsRewards from "platforms/Points"
import polygonIdRewards from "platforms/PolygonID"
import uniqueTextRewards from "platforms/UniqueText"
import textRewards from "platforms/SecretText"
import contractCallRewards from "platforms/ContractCall"
import googleRewards from "platforms/Google"
import discordRewards from "platforms/Discord"
import githubRewards from "platforms/Github"
import poapRewards from "platforms/Poap"
// import { Rewards } from "./types"

export default {
  ...twitterRewards,
  ...emailRewards,
  ...telegramRewards,
  ...tokenRewards,
  ...gatherTownRewards,
  ...formRewards,
  ...pointsRewards,
  ...polygonIdRewards,
  ...uniqueTextRewards,
  ...textRewards,
  ...contractCallRewards,
  ...googleRewards,
  ...discordRewards,
  ...githubRewards,
  ...poapRewards,
} as const satisfies Partial<Rewards>

import type { PlatformName, Requirement } from "types"

/**
 * "CONTRACT_CALL" is left out intentionally, because we store its capacity in the
 * contract, so it isn't handled the same way as other platforms with capacity/time
 */
export const CAPACITY_TIME_PLATFORMS: PlatformName[] = [
  "TEXT",
  "UNIQUE_TEXT",
  "POAP",
  "GATHER_TOWN",
  "ERC20",
] as const

import type { GuildPlatformWithOptionalId, RoleFormType } from "types"
import type { ThemingProps } from "@chakra-ui/react"
import type { RewardProps } from "components/[guild]/RoleCard/components/Reward"
import type { IconProps } from "phosphor-react"
import type {
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react"

export type CardSettingsComponent = () => JSX.Element

export enum PlatformAsRewardRestrictions {
  /**
   * @example
   *   Twitter
   */
  NOT_APPLICABLE,
  /**
   * @example
   *   Telegram
   */
  SINGLE_ROLE,
  /**
   * @example
   *   Discord
   */
  MULTIPLE_ROLES,
}

export type RewardData = {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  imageUrl?: string
  name: string
  colorScheme: ThemingProps["colorScheme"]
  gatedEntity: string
  cardPropsHook?: CardPropsHook
  /**
   * True when the AddRewardPanel just automatically adds the platform without any
   * user input
   */
  autoRewardSetup?: boolean
  cardSettingsComponent?: CardSettingsComponent
  cardMenuComponent?: (props) => JSX.Element
  cardWarningComponent?: (props) => JSX.Element
  cardButton?: (props) => JSX.Element
  AddRewardPanel?: ComponentType<AddRewardPanelProps>
  RewardPreview?: ComponentType<PropsWithChildren<unknown>>
  RoleCardComponent?: ComponentType<RewardProps>
  isPlatform?: boolean
  asRewardRestriction: PlatformAsRewardRestrictions
}

export type Rewards = Readonly<Record<PlatformName, RewardData>>

export type AddRewardPanelProps = {
  onAdd: (
    data: RoleFormType["rolePlatforms"][number] & {
      requirements?: Requirement[]
      roleName?: string
    }
  ) => void
  skipSettings?: boolean
}

export type CardPropsHook = (guildPlatform: GuildPlatformWithOptionalId) => {
  type: PlatformName
  name: string
  image?: string | JSX.Element
  info?: string | JSX.Element
  link?: string
  shouldHide?: boolean
}

export const modalSizeForPlatform = (platform: PlatformName) => {
  switch (platform) {
    case "ERC20":
    case "POINTS":
      return "xl"
    case "UNIQUE_TEXT":
    case "TEXT":
      return "2xl"
    case "POAP":
      return "lg"
    case "TELEGRAM":
      return "md"
    case "CONTRACT_CALL":
      return "4xl"
    default:
      return "3xl"
  }
}
