"use client"

import { Anchor } from "@/components/ui/Anchor"
import { Card } from "@/components/ui/Card"
import { REFERRER_USER_SEARCH_PARAM_KEY } from "@app/(marketing)/create-profile/(onboarding)/constants"
import { ArrowRight, Mountains } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import { useProfile } from "../_hooks/useProfile"

export const JoinProfileAction = () => {
  const profile = useProfile()
  const user = useUser()
  if (!profile.data || user.guildProfile) {
    return
  }
  return (
    <div className="fixed bottom-8 flex w-full justify-center px-4">
      <Anchor
        variant="unstyled"
        className="rounded-2xl"
        href={`/create-profile/claim-pass?${REFERRER_USER_SEARCH_PARAM_KEY}=${profile.data.username}`}
      >
        <Card
          className="slide-in-from-bottom fade-in max-w-md animate-in border border-transparent font-medium leading-tight duration-700"
          style={{
            background:
              "padding-box linear-gradient(hsl(var(--card-secondary)), hsl(var(--card-secondary))), border-box linear-gradient(45deg, hsl(var(--primary)), violet, yellow, orange)",
          }}
        >
          <div className="flex items-center gap-3 p-4">
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
          </div>
        </Card>
      </Anchor>
    </div>
  )
}
