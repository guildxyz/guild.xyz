import dynamic from "next/dynamic";
import OuterRewardPreview from "platforms/components/RewardPreview";

export const RewardPreview = dynamic(() => import("platforms/components/TokenPreview"), {
  ssr: false,
  loading: () => <OuterRewardPreview isLoading />,
})

export function DynamicRewardPreview(importPath: string) {
  return dynamic(() => import(importPath), {
    ssr: false,
    loading: () => <OuterRewardPreview isLoading />,
  })
}
