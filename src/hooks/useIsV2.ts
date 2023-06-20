import { useFeatureFlagVariantKey } from "posthog-js/react"

const V2_FEATURE_FLAG_KEY = "api-version"
const V2_FEATURE_FLAG_VARIANT = "api-v2"

const useIsV2 = () => {
  const variant = useFeatureFlagVariantKey(V2_FEATURE_FLAG_KEY)

  return variant === V2_FEATURE_FLAG_VARIANT
}

export default useIsV2
