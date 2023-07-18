import { useWeb3React } from "@web3-react/core"
import { posthog } from "posthog-js"
import { useFeatureFlagEnabled } from "posthog-js/react"
import { useEffect } from "react"
import useV2Addresses from "./useV2Addresses"

const V2_FEATURE_FLAG_KEY = "api-v2"

const useIsV2 = () => {
  const { account } = useWeb3React()
  const v2Addresses = useV2Addresses()
  const isFlagEnabled = useFeatureFlagEnabled(V2_FEATURE_FLAG_KEY)
  const shouldHaveV2 = !!account && v2Addresses.has(account.toLowerCase())

  useEffect(() => {
    if (shouldHaveV2) {
      posthog.updateEarlyAccessFeatureEnrollment("api-v2", true)
    }
  }, [shouldHaveV2])

  return shouldHaveV2 || isFlagEnabled
}

export default useIsV2
