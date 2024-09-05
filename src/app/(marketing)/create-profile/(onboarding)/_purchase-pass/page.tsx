"use client"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreateProfileSkeleton } from "../_components/CreateProfileSkeleton"
import { PurchasePass } from "../_components/PurchasePass"
import { createProfileDataAtom } from "../atoms"

const Page = () => {
  const [data] = useAtom(createProfileDataAtom)
  const router = useRouter()

  useEffect(() => {
    if (!data.chosenSubscription) {
      router.replace("choose-pass")
    }
    if (!data.referrerProfile) {
      router.replace("prompt-referrer")
    }
  }, [data, router.replace])

  if (!data.chosenSubscription || !data.referrerProfile) {
    return <CreateProfileSkeleton />
  }

  return (
    <PurchasePass
      data={data}
      dispatchAction={({ action }) => {
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
