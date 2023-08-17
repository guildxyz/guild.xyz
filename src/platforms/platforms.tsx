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
import { GuildPlatform, PlatformName } from "types"
import PlatformPreview from "./components/PlatformPreview"
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

export enum PlatformAsRewardRestrictions {
  NOT_APPLICABLE, // e.g. Twitter
  SINGLE_ROLE, // e.g. Telegram
  MULTIPLE_ROLES, // e.g. Discord
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
  asRewardRestriction: PlatformAsRewardRestrictions
  AddPlatformPanel?: ComponentType<{
    onSuccess: () => void
    skipSettings?: boolean
  }>
  PlatformPreview?: ComponentType<Record<string, never>>
}

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
    cardMenuComponent: TelegramCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTelegramPanel"
        ),
      { ssr: false }
    ),
    PlatformPreview: dynamic(() => import("platforms/components/TelegramPreview"), {
      ssr: false,
      loading: () => <PlatformPreview isLoading={true} />,
    }),
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    cardPropsHook: useDiscordCardProps,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddDiscordPanel"
        ),
      { ssr: false }
    ),
    PlatformPreview: dynamic(() => import("platforms/components/DiscordPreview"), {
      ssr: false,
      loading: () => <PlatformPreview isLoading={true} />,
    }),
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    cardPropsHook: useGithubCardProps,
    cardMenuComponent: GithubCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
        ),
      { ssr: false }
    ),
    PlatformPreview: dynamic(() => import("platforms/components/GitHubPreview"), {
      ssr: false,
      loading: () => <PlatformPreview isLoading={true} />,
    }),
  },
  TWITTER: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  },
  TWITTER_V1: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
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
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGooglePanel"
        ),
      { ssr: false }
    ),
    PlatformPreview: dynamic(() => import("platforms/components/GooglePreview"), {
      ssr: false,
      loading: () => <PlatformPreview isLoading={true} />,
    }),
  },
  POAP: {
    icon: null,
    name: "POAP",
    colorScheme: "purple",
    gatedEntity: "POAP",
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    PlatformPreview: dynamic(() => import("platforms/components/PoapPreview"), {
      ssr: false,
      loading: () => <PlatformPreview isLoading={true} />,
    }),
  },
  CONTRACT_CALL: {
    icon: null,
    name: "NFT",
    colorScheme: "cyan",
    gatedEntity: "",
    cardPropsHook: useContractCallCardProps,
    cardButton: ContractCallRewardCardButton,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddPlatformPanel: null, // TODO: will add in another PR
    PlatformPreview: null, // TODO: will add in another PR
  },
}

export default platforms
