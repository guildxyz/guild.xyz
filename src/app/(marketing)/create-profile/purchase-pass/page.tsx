"use client"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { PurchasePass } from "../_components/PurchasePass"
import { chainDataAtom } from "../atoms"

const Page = () => {
  const [chainData] = useAtom(chainDataAtom)
  const router = useRouter()

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
