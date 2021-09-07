import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import useCommunityData from "./useCommunityData"

const useRedirectIfNotOwner = () => {
  const { account, active } = useWeb3React()
  const router = useRouter()
  const { communityData } = useCommunityData()
  const isOwner = useMemo(
    () =>
      communityData?.owner?.addresses?.some(
        ({ address }) => address === account?.toLowerCase()
      ),
    [communityData, account]
  )
  const redirectUrl = `/${communityData?.urlName}`

  useEffect(() => {
    if (typeof account === "string" && !isOwner) router.push(redirectUrl)
  }, [account, isOwner, router, redirectUrl])

  if (!active) return false
  return isOwner
}

export default useRedirectIfNotOwner
