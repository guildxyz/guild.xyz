import { Center, Spinner, ThemingProps } from "@chakra-ui/react"
import { RewardProps } from "components/[guild]/RoleCard/components/Reward"
import dynamic from "next/dynamic"
import {
  Buildings,
  DiscordLogo,
  EnvelopeSimple,
  GithubLogo,
  GoogleLogo,
  IconProps,
  PencilSimpleLine,
  TelegramLogo,
} from "phosphor-react"
import React, {
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithChildren,
} from "react"
import Box from "static/icons/box.svg"
import Key from "static/icons/key.svg"
import Photo from "static/icons/photo.svg"
import Star from "static/icons/star.svg"
import XLogo from "static/icons/x.svg"
import { GuildPlatformWithOptionalId, PlatformName, RoleFormType } from "types"
import ContractCallCardMenu from "./ContractCall/ContractCallCardMenu"
import ContractCallRewardCardButton from "./ContractCall/ContractCallRewardCardButton"
import useContractCallCardProps from "./ContractCall/useContractCallCardProps"
import DiscordCardMenu from "./Discord/DiscordCardMenu"
import DiscordCardSettings from "./Discord/DiscordCardSettings"
import useDiscordCardProps from "./Discord/useDiscordCardProps"
import FormCardLinkButton from "./Forms/FormCardLinkButton"
import FormCardMenu from "./Forms/FormCardMenu"
import useFormCardProps from "./Forms/useFormCardProps"
import GatherCardButton from "./Gather/GatherCardButton"
import GatherCardMenu from "./Gather/GatherCardMenu"
import useGatherCardProps from "./Gather/useGatherCardProps"
import GithubCardMenu from "./Github/GithubCardMenu"
import useGithubCardProps from "./Github/useGithubCardProps"
import GoogleCardMenu from "./Google/GoogleCardMenu"
import GoogleCardSettings from "./Google/GoogleCardSettings"
import GoogleCardWarning from "./Google/GoogleCardWarning"
import useGoogleCardProps from "./Google/useGoogleCardProps"
import PoapCardButton from "./Poap/PoapCardButton"
import PoapCardMenu from "./Poap/PoapCardMenu"
import usePoapCardProps from "./Poap/usePoapCardProps"
import PointsCardSettings from "./Points/PointsCardSettings"
import usePointsCardProps from "./Points/usePointsCardProps"
import PolygonIDCardButton from "./PolygonID/PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonID/PolygonIDCardMenu"
import usePolygonIDCardProps from "./PolygonID/usePolygonIDCardProps"
import SecretTextCardMenu from "./SecretText/SecretTextCardMenu"
import TextCardButton from "./SecretText/TextCardButton"
import useSecretTextCardProps from "./SecretText/useSecretTextCardProps"
import TelegramCardMenu from "./Telegram/TelegramCardMenu"
import useTelegramCardProps from "./Telegram/useTelegramCardProps"
import UniqueTextCardMenu from "./UniqueText/UniqueTextCardMenu"
import useUniqueTextCardProps from "./UniqueText/useUniqueTextCardProps"
import RewardPreview from "./components/RewardPreview"

export enum PlatformAsRewardRestrictions {
  NOT_APPLICABLE, // e.g. Twitter
  SINGLE_ROLE, // e.g. Telegram
  MULTIPLE_ROLES, // e.g. Discord
}

export const CAPACITY_TIME_PLATFORMS: PlatformName[] = [
  "CONTRACT_CALL",
  "TEXT",
  "UNIQUE_TEXT",
  "POAP",
  "GATHER_TOWN",
]

export type AddRewardPanelProps = {
  onAdd: (data: RoleFormType["rolePlatforms"][number]) => void
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

export type CardSettingsComponent = () => JSX.Element

type RewardData = {
  icon: ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  imageUrl?: string
  name: string
  colorScheme: ThemingProps["colorScheme"]
  gatedEntity: string
  cardPropsHook?: CardPropsHook
  // true when the AddRewardPanel just automatically adds the platform without any user input
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

const AddRewardPanelLoadingSpinner = () => (
  <Center w="full" h="51vh">
    <Spinner size="xl" thickness="4px" />
  </Center>
)

const rewards: Record<PlatformName, RewardData> = {
  EMAIL: {
    icon: EnvelopeSimple,
    name: "Email",
    colorScheme: "blue",
    gatedEntity: "email",
    isPlatform: true,
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  },
  TELEGRAM: {
    icon: TelegramLogo,
    imageUrl: "/platforms/telegram.png",
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
    cardMenuComponent: TelegramCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTelegramPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/TelegramPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    isPlatform: true,
  },
  DISCORD: {
    icon: DiscordLogo,
    imageUrl: "/platforms/discord.png",
    name: "Discord",
    colorScheme: "DISCORD",
    gatedEntity: "server",
    cardPropsHook: useDiscordCardProps,
    cardSettingsComponent: DiscordCardSettings,
    cardMenuComponent: DiscordCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddDiscordPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/DiscordPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    isPlatform: true,
  },
  GITHUB: {
    icon: GithubLogo,
    imageUrl: "/platforms/github.png",
    name: "GitHub",
    colorScheme: "GITHUB",
    gatedEntity: "repo",
    cardPropsHook: useGithubCardProps,
    cardMenuComponent: GithubCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/GitHubPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    isPlatform: true,
  },
  TWITTER: {
    icon: XLogo,
    imageUrl: "/platforms/x.svg",
    name: "X",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  },
  TWITTER_V1: {
    icon: XLogo,
    name: "X",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
    isPlatform: true,
  },
  GOOGLE: {
    icon: GoogleLogo,
    imageUrl: "/platforms/google.png",
    name: "Google Workspace",
    colorScheme: "blue",
    gatedEntity: "document",
    cardPropsHook: useGoogleCardProps,
    cardSettingsComponent: GoogleCardSettings,
    cardMenuComponent: GoogleCardMenu,
    cardWarningComponent: GoogleCardWarning,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGooglePanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/GooglePreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    isPlatform: true,
  },
  POAP: {
    icon: null,
    imageUrl: "/platforms/poap.png",
    name: "POAP",
    colorScheme: "purple",
    gatedEntity: "POAP",
    cardPropsHook: usePoapCardProps,
    cardButton: PoapCardButton,
    cardMenuComponent: PoapCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPoapPanel"
        ),
      {
        ssr: false,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/PoapPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    RoleCardComponent: dynamic(() => import("platforms/components/PoapReward"), {
      ssr: false,
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
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(
      () => import("platforms/components/ContractCallPreview"),
      {
        ssr: false,
        loading: () => <RewardPreview isLoading />,
      }
    ),
    RoleCardComponent: dynamic(
      () => import("platforms/ContractCall/ContractCallReward"),
      {
        ssr: false,
      }
    ),
  },
  TEXT: {
    icon: Box,
    name: "Secret",
    colorScheme: "gray",
    gatedEntity: "",
    cardPropsHook: useSecretTextCardProps,
    cardButton: TextCardButton,
    cardMenuComponent: SecretTextCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddSecretTextPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/SecretTextPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    RoleCardComponent: dynamic(() => import("platforms/components/TextReward"), {
      ssr: false,
    }),
  },
  UNIQUE_TEXT: {
    icon: Key,
    name: "Unique secret",
    colorScheme: "gray",
    gatedEntity: "",
    cardPropsHook: useUniqueTextCardProps,
    cardButton: TextCardButton,
    cardMenuComponent: UniqueTextCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    RewardPreview: dynamic(() => import("platforms/components/UniqueTextPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    RoleCardComponent: dynamic(() => import("platforms/components/TextReward"), {
      ssr: false,
    }),
  },
  POLYGON_ID: {
    icon: Key,
    imageUrl: "/requirementLogos/polygonId.svg",
    name: "PolygonID",
    colorScheme: "purple",
    gatedEntity: "",
    cardPropsHook: usePolygonIDCardProps,
    cardButton: PolygonIDCardButton,
    cardMenuComponent: PolygonIDCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    autoRewardSetup: true,
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPolygonIDPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RewardPreview: dynamic(() => import("platforms/components/PolygonIDPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    RoleCardComponent: dynamic(
      () => import("platforms/components/PolygonIDReward"),
      {
        ssr: false,
      }
    ),
    // Until we don't have a generalized connection flow
    isPlatform: false,
  },
  POINTS: {
    icon: Star,
    name: "Points",
    colorScheme: "gray",
    gatedEntity: "",
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    cardPropsHook: usePointsCardProps,
    cardSettingsComponent: PointsCardSettings,
    RewardPreview: dynamic(() => import("platforms/components/PointsPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RoleCardComponent: dynamic(() => import("platforms/components/PointsReward"), {
      ssr: false,
    }),
  },
  FORM: {
    icon: PencilSimpleLine,
    name: "Form",
    colorScheme: "primary",
    gatedEntity: "",
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    cardPropsHook: useFormCardProps,
    cardButton: FormCardLinkButton,
    cardMenuComponent: FormCardMenu,
    RewardPreview: dynamic(() => import("platforms/components/FormPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RoleCardComponent: dynamic(() => import("platforms/components/FormReward"), {
      ssr: false,
    }),
  },
  GATHER_TOWN: {
    icon: Buildings,
    imageUrl: "/platforms/gather.png",
    name: "Gather",
    colorScheme: "GATHER_TOWN",
    gatedEntity: "space",
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    cardPropsHook: useGatherCardProps,
    cardButton: GatherCardButton,
    cardMenuComponent: GatherCardMenu,
    RewardPreview: dynamic(() => import("platforms/components/GatherPreview"), {
      ssr: false,
      loading: () => <RewardPreview isLoading />,
    }),
    AddRewardPanel: dynamic(
      () =>
        import(
          "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
        ),
      {
        ssr: false,
        loading: AddRewardPanelLoadingSpinner,
      }
    ),
    RoleCardComponent: dynamic(() => import("platforms/components/GatherReward"), {
      ssr: false,
    }),
  },
}

export default rewards
