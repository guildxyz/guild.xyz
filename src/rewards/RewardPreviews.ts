import dynamic from "next/dynamic"
import LoadingRewardPreview from "./components/LoadingRewardPreview"
import { RewardComponentMap, RewardPreview } from "./types"

export const RewardPreviews = {
  GATHER_TOWN: dynamic(() => import("rewards/components/GatherPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  GITHUB: dynamic(() => import("rewards/components/GitHubPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  GOOGLE: dynamic(() => import("rewards/components/GooglePreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  ERC20: dynamic(() => import("rewards/components/TokenPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  UNIQUE_TEXT: dynamic(() => import("rewards/components/UniqueTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  POLYGON_ID: dynamic(() => import("rewards/components/PolygonIDPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  CONTRACT_CALL: dynamic(() => import("rewards/components/ContractCallPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  FORM: dynamic(() => import("rewards/components/FormPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  TELEGRAM: dynamic(() => import("rewards/components/TelegramPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  DISCORD: dynamic(() => import("rewards/components/DiscordPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  POAP: dynamic(() => import("rewards/components/PoapPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  TEXT: dynamic(() => import("rewards/components/SecretTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  POINTS: dynamic(() => import("rewards/components/PointsPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} as const satisfies RewardComponentMap<RewardPreview>
