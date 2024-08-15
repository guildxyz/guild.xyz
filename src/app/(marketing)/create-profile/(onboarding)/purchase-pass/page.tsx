"use client"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ChainSkeleton } from "../_components/ChainSkeleton"
import { PurchasePass } from "../_components/PurchasePass"
import { chainDataAtom } from "../atoms"

const Page = () => {
  const [chainData] = useAtom(chainDataAtom)
  const router = useRouter()

  useEffect(() => {
    if (!chainData.chosenSubscription) {
      router.replace("choose-pass")
    }
    if (!chainData.referrerProfile) {
      router.replace("claim-pass")
    }
  }, [chainData, router.replace])

  if (!chainData.chosenSubscription || !chainData.referrerProfile) {
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
