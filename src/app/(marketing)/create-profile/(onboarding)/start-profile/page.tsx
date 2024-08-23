"use client"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreateProfileSkeleton } from "../_components/CreateProfileSkeleton"
import { StartProfile } from "../_components/StartProfile"
import { createProfileDataAtom } from "../atoms"

const Page = () => {
  const [data] = useAtom(createProfileDataAtom)
  const router = useRouter()

  useEffect(() => {
    if (!data.referrerProfile) {
      router.replace("claim-pass")
    }
  }, [data, router.replace])

  if (!data.referrerProfile) {
    return <CreateProfileSkeleton />
  }

  return (
    <StartProfile
      data={data}
      dispatchAction={({ action }) => {
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
