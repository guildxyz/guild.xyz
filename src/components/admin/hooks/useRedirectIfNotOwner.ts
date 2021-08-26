import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useEffect } from "react"

const useRedirectIfNotOwner = (ownerAddress: string, redirectUrl: string) => {
  const { account, active } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    if (
      typeof ownerAddress === "string" &&
      typeof account === "string" &&
      account.toLowerCase() !== ownerAddress
    ) {
      router.push(redirectUrl)
    }
  }, [account, router, ownerAddress, redirectUrl])

  if (!active) return false
  return account.toLowerCase() === ownerAddress
}

export default useRedirectIfNotOwner
