import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useCommunityData from "./useCommunityData"

const useRedirectIfNotOwner = () => {
  const { account, active } = useWeb3React()
  const router = useRouter()
  const { communityData } = useCommunityData()
  const isOwner = communityData?.owner?.addresses?.some(
    ({ address }) => address === account?.toLowerCase()
  )
  const redirectUrl = `/${communityData?.urlName}`

  useEffect(() => {
    if (!isOwner) router.push(redirectUrl)
  }, [isOwner, router, redirectUrl])

  if (!active) return false
  return isOwner
}

export default useRedirectIfNotOwner
