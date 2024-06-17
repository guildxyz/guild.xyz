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

const rewards = {}

export default rewards
