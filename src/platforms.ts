import { ChakraProps } from "@chakra-ui/react"
import { PlatformCardProps } from "components/[guild]/RolePlatforms/components/PlatformCard"
import DiscordCard, {
  DiscordCardMenu,
  DiscordCardSettings,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/DiscordCard"
import GithubCard from "components/[guild]/RolePlatforms/components/PlatformCard/components/GithubCard"
import GoogleCard from "components/[guild]/RolePlatforms/components/PlatformCard/components/GoogleCard"
import GoogleCardSettings from "components/[guild]/RolePlatforms/components/PlatformCard/components/GoogleCard/components/GoogleCardSettings"
import TelegramCard from "components/[guild]/RolePlatforms/components/PlatformCard/components/TelegramCard"
import {
  DiscordLogo,
  GithubLogo,
  GoogleLogo,
  IconProps,
  TelegramLogo,
  TwitterLogo,
} from "phosphor-react"
import { PlatformName } from "types"

type PlatformData = {
  icon: (props: IconProps) => JSX.Element
  name: string
  colorScheme: ChakraProps["color"]
  gatedEntity: string
  paramName: string
  cardComponent?: (props: PlatformCardProps) => JSX.Element
  cardSettingsComponent?: () => JSX.Element
  cardMenuComponent?: (props) => JSX.Element
}

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    paramName: "telegramId",
    cardComponent: TelegramCard,
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    paramName: "discordId",
    cardComponent: DiscordCard,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    paramName: "githubId",
    cardComponent: GithubCard,
  },
  TWITTER: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    paramName: "twitterId",
  },
  GOOGLE: {
    icon: GoogleLogo,
    name: "Google Workspace",
    colorScheme: "blue",
    gatedEntity: "document",
    paramName: "googleId",
    cardComponent: GoogleCard,
    cardSettingsComponent: GoogleCardSettings,
  },
}

export default platforms
