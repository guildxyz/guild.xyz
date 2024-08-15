"use client"

import { useRouter } from "next/navigation"
import { ClaimPass } from "../_components/ClaimPass"

const Page = () => {
  const router = useRouter()

  return (
    <ClaimPass
      chainData={{}}
      dispatchChainAction={({ action }) => {
        if (action === "next") {
          router.push("choose-pass")
        }
      }}
    />
  )
}

export default Page
