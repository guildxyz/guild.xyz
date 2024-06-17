import dynamic from "next/dynamic"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  RewardPreview: dynamic(() => import("platforms/components/UniqueTextPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/TextReward"), {
    ssr: false,
  }),
}

export default dynamicComponents
