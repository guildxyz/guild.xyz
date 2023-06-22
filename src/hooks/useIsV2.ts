import useUser from "components/[guild]/hooks/useUser"
import { posthog } from "posthog-js"
import { useFeatureFlagEnabled } from "posthog-js/react"
import { useEffect } from "react"

const V2_FEATURE_FLAG_KEY = "api-v2"

// Edge config?
const userIdsToOptIn = new Set([1774738])

const useIsV2 = () => {
  const { id } = useUser()
  const isFlagEnabled = useFeatureFlagEnabled(V2_FEATURE_FLAG_KEY)

  useEffect(() => {
    if (userIdsToOptIn.has(id)) {
      posthog.updateEarlyAccessFeatureEnrollment("api-v2", true)
    }
  }, [id])

  return isFlagEnabled
}

export default useIsV2
