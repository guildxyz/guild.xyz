"use client"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ChainSkeleton } from "../_components/ChainSkeleton"
import { StartProfile } from "../_components/StartProfile"
import { chainDataAtom } from "../atoms"

const Page = () => {
  const [chainData] = useAtom(chainDataAtom)
  const router = useRouter()

  useEffect(() => {
    if (!chainData.referrerProfile) {
      router.replace("claim-pass")
    }
    if (!chainData.subscription) {
      router.replace("choose-pass")
    }
  }, [chainData, router.replace])

  if (!chainData.subscription || !chainData.referrerProfile) {
    return <ChainSkeleton />
  }

  return (
    <StartProfile
      chainData={chainData}
      dispatchChainAction={({ action }) => {
        if (action === "next") {
          // router.push("")
        }
        if (action === "previous") {
          router.back()
        }
      }}
    />
  )
}

export default Page
