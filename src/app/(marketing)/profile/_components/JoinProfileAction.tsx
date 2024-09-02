"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Card } from "@/components/ui/Card"
import { REFERRER_USER_SEARCH_PARAM_KEY } from "@app/(marketing)/create-profile/(onboarding)/constants"
import { ArrowRight, Mountains } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import { useProfile } from "../_hooks/useProfile"

export const JoinProfileAction = () => {
  const profile = useProfile()
  const user = useUser()
  const { isWeb3Connected } = useWeb3ConnectionManager()
  if (
    !profile.data ||
    isWeb3Connected === null ||
    user.guildProfile ||
    user.isLoading
  ) {
    return
  }
  return (
    <div className="pointer-events-none fixed bottom-6 flex w-full justify-center px-4">
      <Anchor
        variant="unstyled"
        className="slide-in-from-bottom fade-in pointer-events-auto animate-in rounded-2xl duration-700"
        href={`/create-profile/prompt-referrer?${REFERRER_USER_SEARCH_PARAM_KEY}=${profile.data.username}`}
      >
        <Card
          className="flex max-w-md items-center gap-3 border border-transparent p-4 font-medium leading-tight"
          style={{
            background:
              "padding-box linear-gradient(hsl(var(--card-secondary)), hsl(var(--card-secondary))), border-box linear-gradient(45deg, hsl(var(--primary)), violet, yellow, orange)",
          }}
        >
          <div className="flex aspect-square items-center justify-center rounded-2xl border bg-card p-2">
            <Mountains className="size-5" weight="fill" />
          </div>
          <div className="text-pretty">
            Join{" "}
            <span className="font-extrabold text-primary-subtle">
              {profile.data.name || profile.data.username}
            </span>{" "}
            on their adventure
            <ArrowRight weight="bold" className="ml-2 inline size-4" />
          </div>
        </Card>
      </Anchor>
    </div>
  )
}
