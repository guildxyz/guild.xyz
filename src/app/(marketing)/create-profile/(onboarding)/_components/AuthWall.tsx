"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"
import { ChainSkeleton } from "./ChainSkeleton"

export const AuthWall = ({ children }: PropsWithChildren) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  // const { toast } = useToast()
  const router = useRouter()
  // const referrerUserId = useSearchParams()?.get(REFERRER_USER_SEARCH_PARAM_KEY)
  // const user = useUser(referrerUserId)

  useEffect(() => {
    if (isWeb3Connected === false) router.replace("/create-profile")
  }, [isWeb3Connected, router.replace])

  // useEffect(() => {
  //   if (isWeb3Connected === false) router.replace("/create-profile")
  //   if (!referrerUserId) router.push("claim-pass")
  //   if (user.guildProfile) router.replace("choose-pass")
  //   toast({
  //     variant: "error",
  //     title: "Failed to identify referrer profile",
  //     description: "Enter the username below and make sure the profile exists",
  //   })
  //   router.replace("claim-pass")
  // }, [router.replace, isWeb3Connected, user, referrerUserId])

  if (!isWeb3Connected) {
    return <ChainSkeleton />
  }

  return children
}
