import { useWeb3React } from "@web3-react/core"
import { posthog } from "posthog-js"
import { useFeatureFlagEnabled } from "posthog-js/react"
import { useEffect } from "react"
import useSWRImmutable from "swr/immutable"
import useV2Addresses from "./useV2Addresses"

const V2_FEATURE_FLAG_KEY = "api-v2"

const useIsV2 = () => {
  const { account } = useWeb3React()
  const v2Addresses = useV2Addresses()
  const isFlagEnabled = useFeatureFlagEnabled(V2_FEATURE_FLAG_KEY)
  const shouldHaveV2 = !!account && v2Addresses.has(account.toLowerCase())

  const { data: isV2, mutate } = useSWRImmutable<boolean>("isV2", null, {
    revalidateOnMount: false,
  })

  useEffect(() => {
    if (shouldHaveV2) {
      posthog.updateEarlyAccessFeatureEnrollment("api-v2", true)
    }
  }, [shouldHaveV2])

  useEffect(() => {
    if (isFlagEnabled) {
      mutate(true, { revalidate: false })
    }
  }, [isFlagEnabled])

  return isV2
}

export default useIsV2
