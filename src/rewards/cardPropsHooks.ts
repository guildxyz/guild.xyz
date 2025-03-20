import useContractCallCardProps from "./ContractCall/useContractCallCardProps"
import useDiscordCardProps from "./Discord/useDiscordCardProps"
import useFarcasterChannelCardProps from "./FarcasterChannel/useFarcasterChannelCardProps"
import useFormCardProps from "./Forms/useFormCardProps"
import useGatherCardProps from "./Gather/useGatherCardProps"
import useGithubCardProps from "./Github/useGithubCardProps"
import useGoogleCardProps from "./Google/useGoogleCardProps"
import usePoapCardProps from "./Poap/usePoapCardProps"
import usePointsCardProps from "./Points/usePointsCardProps"
import useSecretTextCardProps from "./SecretText/useSecretTextCardProps"
import useTelegramCardProps from "./Telegram/useTelegramCardProps"
import useTokenCardProps from "./Token/hooks/useTokenCardProps"
import useUniqueTextCardProps from "./UniqueText/useUniqueTextCardProps"
import { CardPropsHook, RewardComponentMap } from "./types"

export const cardPropsHooks = {
  GATHER_TOWN: useGatherCardProps,
  TELEGRAM: useTelegramCardProps,
  POAP: usePoapCardProps,
  POINTS: usePointsCardProps,
  TEXT: useSecretTextCardProps,
  ERC20: useTokenCardProps,
  GOOGLE: useGoogleCardProps,
  DISCORD: useDiscordCardProps,
  UNIQUE_TEXT: useUniqueTextCardProps,
  CONTRACT_CALL: useContractCallCardProps,
  FORM: useFormCardProps,
  GITHUB: useGithubCardProps,
  FARCASTER_CHANNEL: useFarcasterChannelCardProps,
} as const satisfies RewardComponentMap<CardPropsHook>
