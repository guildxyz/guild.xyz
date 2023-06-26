import { useFeatureFlagEnabled } from "posthog-js/react"

const V2_FEATURE_FLAG_KEY = "api-v2"

const useIsV2 = () => {
  const flagEnabled = useFeatureFlagEnabled(V2_FEATURE_FLAG_KEY)

  return flagEnabled
}

export default useIsV2
