import dynamic from "next/dynamic"
import OuterRewardPreview from "platforms/components/RewardPreview"

export const RewardPreview = dynamic(
  () => import("platforms/components/GatherPreview"),
  {
    ssr: false,
    loading: () => <OuterRewardPreview isLoading />,
  }
)
