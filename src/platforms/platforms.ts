import { ChakraProps } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import {
  DiscordLogo,
  GithubLogo,
  GoogleLogo,
  IconProps,
  TelegramLogo,
  TwitterLogo,
} from "phosphor-react"
import { ComponentType } from "react"
import { GuildPlatform, OneOf, PlatformName } from "types"
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

// If we define an AddPlatformPanel, we'll use the `DefaultAddPlatformModalContent` component in the add reward modal, but if we need a custom solution for that modal (e.g. for the add POAP flow), we can define an AddPlatformModalContent instead
type AddPlatformComponentsParameters = OneOf<
  {
    AddPlatformModalContent: ComponentType<Record<string, never>>
  },
  {
    AddPlatformPanel: ComponentType<{
      onSuccess: () => void
      skipSettings?: boolean
    }>
  }
>

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
  usageRestriction: PlatformUsageRestrictions
} & AddPlatformComponentsParameters

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
    cardMenuComponent: TelegramCardMenu,
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTelegramPanel"
        ),
      { ssr: false }
    ),
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
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddDiscordPanel"
        ),
      { ssr: false }
    ),
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    cardPropsHook: useGithubCardProps,
    cardMenuComponent: GithubCardMenu,
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
        ),
      { ssr: false }
    ),
  },
  TWITTER: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    usageRestriction: PlatformUsageRestrictions.NOT_APPLICABLE,
    AddPlatformPanel: null,
  },
  TWITTER_V1: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    usageRestriction: PlatformUsageRestrictions.NOT_APPLICABLE,
    AddPlatformPanel: null,
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
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGooglePanel"
        ),
      { ssr: false }
    ),
  },
  POAP: {
    icon: null,
    name: "POAP",
    colorScheme: "purple",
    gatedEntity: "POAP",
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
    AddPlatformModalContent: dynamic(() => import("components/[guild]/CreatePoap"), {
      ssr: false,
    }),
  },
  CONTRACT_CALL: {
    icon: null,
    name: "NFT",
    colorScheme: "cyan",
    gatedEntity: "",
    cardPropsHook: useContractCallCardProps,
    cardButton: ContractCallRewardCardButton,
    usageRestriction: PlatformUsageRestrictions.SINGLE_ROLE,
    AddPlatformPanel: null, // TODO: will add in another PR
  },
}

export default platforms
