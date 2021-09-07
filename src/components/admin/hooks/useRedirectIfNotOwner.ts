import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useCommunityData from "./useCommunityData"

const useRedirectIfNotOwner = () => {
  const { account, active } = useWeb3React()
  const router = useRouter()
  const { communityData } = useCommunityData()

  useEffect(() => {
    if (
      typeof account === "string" &&
      !communityData?.owner?.addresses?.some(
        ({ address }) => address === account?.toLowerCase()
      )
    )
      router.push(`/${communityData?.urlName}`)
  }, [account, communityData, router])

  if (!active) return false
  return communityData?.owner?.addresses?.some(
    ({ address }) => address === account?.toLowerCase()
  )
}

export default useRedirectIfNotOwner
