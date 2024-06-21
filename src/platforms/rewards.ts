import twitterRewardV1, { twitterReward } from "platforms/Twitter"
import emailReward from "platforms/Email"
import telegramReward from "platforms/Telegram"
import tokenReward from "platforms/Token"
import gatherTownReward from "platforms/Gather"
import formReward from "platforms/Forms"
import pointsReward from "platforms/Points"
import polygonIdReward from "platforms/PolygonID"
import uniqueTextReward from "platforms/UniqueText"
import textReward from "platforms/SecretText"
import contractCallReward from "platforms/ContractCall"
import googleReward from "platforms/Google"
import discordReward from "platforms/Discord"
import githubReward from "platforms/Github"
import poapReward from "platforms/Poap"

export default {
  TWITTER_V1: twitterRewardV1,
  TWITTER: twitterReward,
  EMAIL: emailReward,
  TELEGRAM: telegramReward,
  ERC20: tokenReward,
  GATHER_TOWN: gatherTownReward,
  FORM: formReward,
  POINTS: pointsReward,
  POLYGON_ID: polygonIdReward,
  UNIQUE_TEXT: uniqueTextReward,
  TEXT: textReward,
  CONTRACT_CALL: contractCallReward,
  GOOGLE: googleReward,
  DISCORD: discordReward,
  GITHUB: githubReward,
  POAP: poapReward,
} as const satisfies Partial<Rewards>

// TODO: resolve duplication by renaming rewards.ts to index.ts and updating imports

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
