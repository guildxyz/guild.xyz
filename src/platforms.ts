import { ChakraProps } from "@chakra-ui/react"
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
}

const platforms: Record<PlatformName, PlatformData> = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    paramName: "telegramId",
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    paramName: "discordId",
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    paramName: "githubId",
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
  },
}

export default platforms
