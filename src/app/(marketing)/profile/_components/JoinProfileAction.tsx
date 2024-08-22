"use client"

import { Anchor } from "@/components/ui/Anchor"
import { Card } from "@/components/ui/Card"
import { REFERRER_USER_SEARCH_PARAM_KEY } from "@app/(marketing)/create-profile/(onboarding)/constants"
import { ArrowRight } from "@phosphor-icons/react"
import { useProfile } from "../_hooks/useProfile"

export const JoinProfileAction = () => {
  const profile = useProfile()
  if (!profile.data) {
    return
  }
  return (
    <Anchor
      className="fixed bottom-8 flex w-full justify-center px-8"
      variant="unstyled"
      href={`/create-profile/claim-pass?${REFERRER_USER_SEARCH_PARAM_KEY}=${profile.data.username}`}
    >
      <Card className="max-w-sm border border-pink-500 px-7 py-5 text-center sm:text-lg">
        Join{" "}
        <span className="font-bold text-primary">
          {profile.data.name || profile.data.username}
        </span>{" "}
        on their adventure <ArrowRight weight="bold" className="ml-1 inline-block" />
      </Card>
    </Anchor>
  )
}
