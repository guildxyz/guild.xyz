"use client"

import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { ChoosePass } from "../_components/ChoosePass"
import { chainDataAtom } from "../atoms"

const Page = () => {
  const setChainData = useSetAtom(chainDataAtom)
  const router = useRouter()

  return (
    <ChoosePass
      chainData={{}}
      dispatchChainAction={({ action, data }) => {
        if (action === "next" && data) {
          setChainData(data)
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
