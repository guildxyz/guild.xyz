import { ChakraProps } from "@chakra-ui/react"
import GoogleSelectButton from "components/create-guild/PlatformsGrid/components/GoogleSelectButton"
import TelegramSelectButton from "components/create-guild/PlatformsGrid/components/TelegramSelectButton"
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
import React from "react"
import { GuildPlatform } from "types"

type PlatformData = {
  id: number
  icon: (props: IconProps) => JSX.Element
  name: string
  colorScheme: ChakraProps["color"]
  paramName: string
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

  oauthParams?: {
    // These are snake_case, so we can pass them to oauth directly
    client_id: string
    baseUrl: string
    scope: {
      membership: string
      creation?: string
    }
    code_challenge?: "challenge"
    code_challenge_method?: "plain"
  }

  /**
   * This prop is only needed if oauthParams is not specified. Should only be needed
   * for Telegram, once Google is reimplemented for common abstractions
   */
  CreationGridSelectButton?: React.FC

  /** These are only specified for gateable platforms */
  gatedEntity?: string
  creationDescription?: string
}

export type PlatformName = "TELEGRAM" | "DISCORD" | "GITHUB" | "TWITTER" | "GOOGLE"

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    id: 2,
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    creationDescription: "Token gate your group",
    paramName: "telegramId",
    cardPropsHook: useTelegramCardProps,
    CreationGridSelectButton: TelegramSelectButton,
  },
  DISCORD: {
    id: 1,
    icon: DiscordLogo,
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    creationDescription: "Manage roles & guard server",
    paramName: "discordId",
    cardPropsHook: useDiscordCardProps,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
    oauthParams: {
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
      baseUrl: "https://discord.com/api/oauth2/authorize",
      scope: {
        membership: "guilds identify guilds.members.read",
      },
    },
  },
  GITHUB: {
    id: 3,
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    creationDescription: "Token gate your repositories",
    paramName: "githubId",
    cardPropsHook: useGithubCardProps,
    oauthParams: {
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      baseUrl: "https://github.com/login/oauth/authorize",
      scope: {
        membership: "repo:invite,read:user",
        creation: "repo,read:user",
      },
    },
  },
  TWITTER: {
    id: 5,
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    paramName: "twitterId",
    oauthParams: {
      client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
      baseUrl: "https://twitter.com/i/oauth2/authorize",
      scope: {
        membership: "tweet.read users.read follows.read offline.access",
      },
      code_challenge: "challenge",
      code_challenge_method: "plain",
    },
  },
  GOOGLE: {
    id: 4,
    icon: GoogleLogo,
    name: "Google Workspace",
    colorScheme: "blue",
    gatedEntity: "document",
    creationDescription: "Token gate documents",
    paramName: "googleId",
    cardPropsHook: useGoogleCardProps,
    cardSettingsComponent: GoogleCardSettings,
    cardWarningComponent: GoogleCardWarning,
    oauthParams: {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      baseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      scope: {
        membership: "openid email profile",
      },
    },
    CreationGridSelectButton: GoogleSelectButton,
  },
}

const platformIdToName = Object.fromEntries(
  Object.entries(platforms).map(([platformName, { id }]) => [
    id,
    platformName as PlatformName,
  ])
)

export { platformIdToName }
export default platforms
