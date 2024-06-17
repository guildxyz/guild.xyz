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
import Token from "static/icons/token.svg"
import {
  GuildPlatformWithOptionalId,
  PlatformName,
  Requirement,
  RoleFormType,
} from "types"
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
import usePointsCardProps from "./Points/usePointsCardProps"
import PolygonIDCardButton from "./PolygonID/PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonID/PolygonIDCardMenu"
import usePolygonIDCardProps from "./PolygonID/usePolygonIDCardProps"
import SecretTextCardMenu from "./SecretText/SecretTextCardMenu"
import TextCardButton from "./SecretText/TextCardButton"
import useSecretTextCardProps from "./SecretText/useSecretTextCardProps"
import TelegramCardMenu from "./Telegram/TelegramCardMenu"
import useTelegramCardProps from "./Telegram/useTelegramCardProps"
import ClaimTokenButton from "./Token/ClaimTokenButton"
import useTokenCardProps from "./Token/hooks/useTokenCardProps"
import UniqueTextCardMenu from "./UniqueText/UniqueTextCardMenu"
import useUniqueTextCardProps from "./UniqueText/useUniqueTextCardProps"
import RewardPreview from "./components/RewardPreview"

const rewards = {
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
}

export default rewards
