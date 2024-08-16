"use client"

import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { ChoosePass } from "../_components/ChoosePass"
import { chainDataAtom } from "../atoms"

const Page = () => {
  const router = useRouter()
  const setChainData = useSetAtom(chainDataAtom)

  return (
    <ChoosePass
      chainData={{}}
      dispatchChainAction={({ action, data }) => {
        if (action === "next") {
          if (!data?.chosenSubscription) {
            throw new Error("Tried to resolve choose pass without value")
          }
          setChainData((prev) => ({ ...prev, ...data }))
          router.push("purchase-pass")
        }
        if (action === "previous") {
          router.back()
        }
      }}
    />
  )
}

export default Page
