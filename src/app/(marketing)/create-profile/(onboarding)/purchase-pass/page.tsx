"use client"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ChainSkeleton } from "../_components/ChainSkeleton"
import { PurchasePass } from "../_components/PurchasePass"
import { chainDataAtom } from "../atoms"
// import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"

const Page = () => {
  const [chainData] = useAtom(chainDataAtom)
  const router = useRouter()
  // const connection = useWeb3ConnectionManager()
  // console.log("address", connection)
  // if (!connection.address) {
  //   router.push("claim-pass")
  // }

  useEffect(() => {
    if (!chainData.chosenSubscription) {
      router.replace("choose-pass")
    }
    if (chainData.subscription) {
      router.replace("start-profile")
    }
  }, [chainData, router.replace])

  if (!chainData.chosenSubscription) {
    return <ChainSkeleton />
  }

  return (
    <PurchasePass
      chainData={chainData}
      dispatchChainAction={({ action }) => {
        if (action === "next") {
          router.push("start-profile")
        }
        if (action === "previous") {
          router.back()
        }
      }}
    />
  )
}

export default Page
