import { ChakraProps } from "@chakra-ui/react"
import useDiscordCardProps, {
  DiscordCardMenu,
  DiscordCardSettings,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/useDiscordCardProps"
import useGithubCardProps from "components/[guild]/RolePlatforms/components/PlatformCard/components/useGithubCardProps"
import useGoogleCardProps from "components/[guild]/RolePlatforms/components/PlatformCard/components/useGoogleCardProps"
import GoogleCardSettings from "components/[guild]/RolePlatforms/components/PlatformCard/components/useGoogleCardProps/GoogleCardSettings"
import GoogleCardWarning from "components/[guild]/RolePlatforms/components/PlatformCard/components/useGoogleCardProps/GoogleCardWarning"
import useTelegramCardProps from "components/[guild]/RolePlatforms/components/PlatformCard/components/useTelegramCardProps"
import {
  DiscordLogo,
  GithubLogo,
  GoogleLogo,
  IconProps,
  TelegramLogo,
  TwitterLogo,
} from "phosphor-react"
import { GuildPlatform, PlatformName } from "types"

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
}

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    cardPropsHook: useDiscordCardProps,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    cardPropsHook: useGithubCardProps,
  },
  TWITTER: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
  },
  POAP: {
    icon: TwitterLogo,
    name: "POAP",
    colorScheme: "purple",
    gatedEntity: "poap",
  },
  GOOGLE: {
    icon: GoogleLogo,
    name: "Google Workspace",
    colorScheme: "blue",
    gatedEntity: "document",
    cardPropsHook: useGoogleCardProps,
    cardSettingsComponent: GoogleCardSettings,
    cardWarningComponent: GoogleCardWarning,
  },
}

export default platforms
