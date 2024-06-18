import dynamic from "next/dynamic"
import OuterRewardPreview from "platforms/components/RewardPreview"

export const RewardPreview = dynamic(
  () => import("platforms/components/FormPreview"),
  {
    ssr: false,
    loading: () => <OuterRewardPreview isLoading />,
  }
)
