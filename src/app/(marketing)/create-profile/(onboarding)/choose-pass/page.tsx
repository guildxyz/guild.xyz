"use client"

import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { ChoosePass } from "../_components/ChoosePass"
import { createProfileDataAtom } from "../atoms"

const Page = () => {
  const router = useRouter()
  const setData = useSetAtom(createProfileDataAtom)

  return (
    <ChoosePass
      data={{}}
      dispatchAction={({ action, data }) => {
        if (action === "next") {
          if (!data?.chosenSubscription) {
            throw new Error("Tried to resolve choose pass without value")
          }
          setData((prev) => ({ ...prev, ...data }))
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
