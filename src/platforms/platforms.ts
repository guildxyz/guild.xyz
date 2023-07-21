import { ChakraProps } from "@chakra-ui/react"
import {
  DiscordLogo,
  GithubLogo,
  GoogleLogo,
  IconProps,
  TelegramLogo,
  TwitterLogo,
} from "phosphor-react"
import { GuildPlatform, PlatformName } from "types"
import ContractCallRewardCardButton from "./ContractCall/ContractCallRewardCardButton"
import useContractCallCardProps from "./ContractCall/useContractCallCardProps"
import DiscordCardMenu from "./Discord/DiscordCardMenu"
import DiscordCardSettings from "./Discord/DiscordCardSettings"
import useDiscordCardProps from "./Discord/useDiscordCardProps"
import GithubCardMenu from "./Github/GithubCardMenu"
import useGithubCardProps from "./Github/useGithubCardProps"
import GoogleCardMenu from "./Google/GoogleCardMenu"
import GoogleCardSettings from "./Google/GoogleCardSettings"
import GoogleCardWarning from "./Google/GoogleCardWarning"
import useGoogleCardProps from "./Google/useGoogleCardProps"
import TelegramCardMenu from "./Telegram/TelegramCardMenu"
import useTelegramCardProps from "./Telegram/useTelegramCardProps"

export enum PlatformUsageRestrictions {
  NOT_APPLICABLE, // e.g. Twitter
  SINGLE_ROLE, // e.g. Telegram
  MULTIPLE_ROLES, // e.g. Discord
}

type PaltformUsageRestrictionsParameters =
  | {
      usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE
      usageUniqueParam?: never
    }
  | {
      usageRestriction: Exclude<
        PlatformUsageRestrictions,
        PlatformUsageRestrictions.SINGLE_ROLE
      >
      usageUniqueParam?: string // If we define this, we can check the uniqueness of a field inside `rolePlatform`
    }

type PlatformData = {
  icon: (props: IconProps) => JSX.Element
  name: string
  colorScheme: ChakraProps["color"]
  gatedEntity: string
  cardPropsHook?: (guildPlatform: GuildPlatform) => {
    type: PlatformName
    name: string
    image?: string | JSX.Element
    info?: string
    link?: string
  }
  cardSettingsComponent?: () => JSX.Element
  cardMenuComponent?: (props) => JSX.Element
  cardWarningComponent?: (props) => JSX.Element
  cardButton?: (props) => JSX.Element
} & PaltformUsageRestrictionsParameters

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
    cardMenuComponent: TelegramCardMenu,
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    cardPropsHook: useDiscordCardProps,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
    usageRestriction: PlatformUsageRestrictions.MULTIPLE_ROLES,
    usageUniqueParam: "platformRoleId",
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    cardPropsHook: useGithubCardProps,
    cardMenuComponent: GithubCardMenu,
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
  },
  TWITTER: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    usageRestriction: PlatformUsageRestrictions.NOT_APPLICABLE,
  },
  TWITTER_V1: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    usageRestriction: PlatformUsageRestrictions.NOT_APPLICABLE,
  },
  GOOGLE: {
    icon: GoogleLogo,
    name: "Google Workspace",
    colorScheme: "blue",
    gatedEntity: "document",
    cardPropsHook: useGoogleCardProps,
    cardSettingsComponent: GoogleCardSettings,
    cardMenuComponent: GoogleCardMenu,
    cardWarningComponent: GoogleCardWarning,
    usageRestriction: PlatformUsageRestrictions.MULTIPLE_ROLES,
    usageUniqueParam: "platformRoleData.role",
  },
  POAP: {
    icon: null,
    name: "POAP",
    colorScheme: "purple",
    gatedEntity: "POAP",
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
  },
  CONTRACT_CALL: {
    icon: null,
    name: "NFT",
    colorScheme: "cyan",
    gatedEntity: "",
    cardPropsHook: useContractCallCardProps,
    cardButton: ContractCallRewardCardButton,
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
  },
}

export default platforms
