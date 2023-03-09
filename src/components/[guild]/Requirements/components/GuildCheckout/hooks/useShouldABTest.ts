import { useFeatureFlagVariantKey } from "posthog-js/react"

const useShouldABTest = (): boolean => {
  const postHogFeatureFlag = useFeatureFlagVariantKey("TOKEN_BUYER_FEE")
  return postHogFeatureFlag?.toString() === "high-fee"
}

export default useShouldABTest
