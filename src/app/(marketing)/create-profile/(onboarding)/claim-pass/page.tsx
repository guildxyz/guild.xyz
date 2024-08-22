"use client"

import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { useSetAtom } from "jotai"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import useSWRImmutable from "swr/immutable"
import { ChainSkeleton } from "../_components/ChainSkeleton"
import { ClaimPass } from "../_components/ClaimPass"
import { chainDataAtom } from "../atoms"
import { REFERRER_USER_SEARCH_PARAM_KEY } from "../constants"

const Page = () => {
  const router = useRouter()
  const { toast } = useToast()
  const referrerUsername = useSearchParams()?.get(REFERRER_USER_SEARCH_PARAM_KEY)
  const didReferrerValidate = useRef(false)
  const referrer = useSWRImmutable<Schemas["Profile"]>(
    referrerUsername ? `/v2/profiles/${referrerUsername}` : null,
    { shouldRetryOnError: false }
  )
  const setChainData = useSetAtom(chainDataAtom)

  useEffect(() => {
    if (!referrerUsername || didReferrerValidate.current) return
    if (referrer.error) {
      didReferrerValidate.current = true
      toast({
        variant: "error",
        title: "Failed to identify referrer profile",
        description: "Enter the username below and make sure the profile exists",
      })
    }
  }, [referrer.error, referrerUsername, toast])

  if (referrer.isLoading) {
    return <ChainSkeleton />
  }

  return (
    <ClaimPass
      chainData={{ referrerProfile: referrer.data }}
      dispatchChainAction={({ action, data }) => {
        if (action === "next") {
          if (!data?.referrerProfile) {
            throw new Error("Tried to resolve referrer profile without value")
          }
          setChainData((prev) => ({
            ...prev,
            referrerProfile: data.referrerProfile,
          }))
          router.push("choose-pass")
        }
      }}
    />
  )
}

export default Page
