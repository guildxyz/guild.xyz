import { useWeb3React } from "@web3-react/core"
import { posthog } from "posthog-js"
import { useFeatureFlagEnabled } from "posthog-js/react"
import { useEffect } from "react"

const V2_FEATURE_FLAG_KEY = "api-v2"

// Edge config?
const addressesToOptIn = new Set(["0x82407168ca396e800e55c8667af2a7516c5140dd"])

const useIsV2 = () => {
  const { account } = useWeb3React()
  const isFlagEnabled = useFeatureFlagEnabled(V2_FEATURE_FLAG_KEY)
  const shouldHaveV2 = !!account && addressesToOptIn.has(account.toLowerCase())

  useEffect(() => {
    if (shouldHaveV2) {
      posthog.updateEarlyAccessFeatureEnrollment("api-v2", true)
    }
  }, [shouldHaveV2])

  return shouldHaveV2 || isFlagEnabled
}

export default useIsV2
