"use client"

import { Anchor } from "@/components/ui/Anchor"
import { buttonVariants } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "@phosphor-icons/react"

export const NotificationContent = () => (
  <div className="px-4">
    <Anchor
      variant="unstyled"
      className={cn(
        buttonVariants({ variant: "ghost", size: "md" }),
        "w-full gap-2"
      )}
      href="/profile/activity"
    >
      View recent activity
      <ArrowRight />
    </Anchor>
  </div>
)
