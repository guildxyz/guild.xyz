import { ChakraProps } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import {
  DiscordLogo,
  EnvelopeSimple,
  GithubLogo,
  GoogleLogo,
  IconProps,
  TelegramLogo,
  TwitterLogo,
} from "phosphor-react"
import { ComponentType } from "react"
import Photo from "static/icons/photo.svg"
import { GuildPlatform, OneOf, PlatformName } from "types"
import fetcher from "utils/fetcher"
import PlatformPreview from "./components/PlatformPreview"
import ContractCallCardMenu from "./ContractCall/ContractCallCardMenu"
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

type PlatformData<
  OAuthParams extends {
    client_id?: string
    scope?: string | { membership: string; creation: string }
  } = {
    client_id?: string
    scope?: string | { membership: string; creation: string }
  } & Record<string, any>
> = {
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
  AddPlatformPanel?: ComponentType<{
    onSuccess: () => void
    skipSettings?: boolean
  }>
  PlatformPreview?: ComponentType<Record<string, never>>

  oauth?: {
    url: string
    params: OAuthParams

    // Probably only will be needed for Twitter v1. Once Twitter shuts it down, we will remove it, and this field can be removed as well
    oauthOptionsInitializer?: (
      redirectUri: string,
      address?: string
    ) => Promise<OAuthParams>
  }
} & OneOf<
  {
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE
  },
  {
    asRewardRestriction: Exclude<
      PlatformAsRewardRestrictions,
      PlatformAsRewardRestrictions.NOT_APPLICABLE
    >
    shouldShowKeepAccessesModal: boolean
  }
>

const platforms: Record<PlatformName, PlatformData> = {
  EMAIL: {
    icon: EnvelopeSimple,
    name: "E-Mail",
    colorScheme: "gray",
    gatedEntity: "email",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,

    oauth: {
      oauthOptionsInitializer: async (_, address) => ({ address }),
      url: `${
        typeof window === "undefined" ? "https://guild.xyz" : window.origin
      }/email-verification`,
      params: {},
    },
  },
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
    cardMenuComponent: TelegramCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    shouldShowKeepAccessesModal: true,
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

    oauth: {
      url: process.env.NEXT_PUBLIC_TELEGRAM_POPUP_URL,
      params: {
        bot_id: process.env.NEXT_PUBLIC_TG_BOT_ID,
        origin: typeof window === "undefined" ? "https://guild.xyz" : window.origin,
        request_access: "write", // TODO
        lang: "en",

        // Used on our /tgAuth route to know where to postMessage the result (window.opener.origin is unavailable due to opener and the popup having different origins)
        openerOrigin:
          typeof window !== "undefined"
            ? window.location.origin
            : "https://guild.xyz",
      },
    },
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
    shouldShowKeepAccessesModal: true,
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

    oauth: {
      url: "https://discord.com/api/oauth2/authorize",
      params: {
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
        scope: "guilds identify guilds.members.read",
      },
    },
  },
  GITHUB: {
    icon: GithubLogo,
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    cardPropsHook: useGithubCardProps,
    cardMenuComponent: GithubCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    shouldShowKeepAccessesModal: true,
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

    oauth: {
      url: "https://github.com/login/oauth/authorize",
      params: {
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        scope: {
          creation: "repo,read:user",
          membership: "repo:invite,read:user",
        },
      },
    },
  },
  TWITTER: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,

    oauth: {
      url: "https://twitter.com/i/oauth2/authorize",
      params: {
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
        scope:
          "tweet.read users.read follows.read like.read list.read offline.access",
        code_challenge: "challenge",
        code_challenge_method: "plain",
      },
    },
  },
  TWITTER_V1: {
    icon: TwitterLogo,
    name: "Twitter",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,

    oauth: {
      url: "https://api.twitter.com/oauth/authorize",
      params: {
        oauth_callback:
          typeof window === "undefined"
            ? "https://guild.xyz/oauth"
            : `${window.origin}/oauth`,
        x_auth_access_type: "read",
      },
      oauthOptionsInitializer: (callbackUrl) =>
        fetcher(
          `/api/twitter-request-token?callbackUrl=${encodeURIComponent(callbackUrl)}`
        ).then((oauth_token) => ({ oauth_token } as any)),
    },
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
    shouldShowKeepAccessesModal: true,
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

    oauth: {
      url: "https://accounts.google.com/o/oauth2/v2/auth",
      params: {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
      },
    },
  },
  POAP: {
    icon: null,
    name: "POAP",
    colorScheme: "purple",
    gatedEntity: "POAP",
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    shouldShowKeepAccessesModal: false,
    PlatformPreview: dynamic(() => import("platforms/components/PoapPreview"), {
      ssr: false,
      loading: () => <PlatformPreview isLoading={true} />,
    }),
  },
  CONTRACT_CALL: {
    icon: Photo,
    name: "NFT",
    colorScheme: "cyan",
    gatedEntity: "",
    cardPropsHook: useContractCallCardProps,
    cardButton: ContractCallRewardCardButton,
    cardMenuComponent: ContractCallCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    shouldShowKeepAccessesModal: false,
    AddPlatformPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel"
        ),
      { ssr: false }
    ),
    PlatformPreview: dynamic(
      () => import("platforms/components/ContractCallPreview"),
      {
        ssr: false,
        loading: () => <PlatformPreview isLoading={true} />,
      }
    ),
  },
}

export default platforms
