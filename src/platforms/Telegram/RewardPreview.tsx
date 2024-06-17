import dynamic from "next/dynamic";
import OuterRewardPreview from "rewards/components/RewardPreview";

export const RewardPreview = dynamic(() => import("platforms/components/TelegramPreview"), {
  ssr: false,
  loading: () => <OuterRewardPreview isLoading />,
})
