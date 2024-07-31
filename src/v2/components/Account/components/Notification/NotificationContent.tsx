"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { buttonVariants } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import { ArrowRight } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { Web3InboxSkeleton } from "./Web3InboxSkeleton"

const DynamicWeb3Inbox = dynamic(() => import("./Web3Inbox"), {
  ssr: false,
  loading: Web3InboxSkeleton,
})

export const NotificationContent = () => {
  const { type } = useWeb3ConnectionManager()

  return (
    <div>
      {type === "EVM" && (
        <>
          <section>
            <h3 className="mx-4 mb-4 font-bold text-muted-foreground text-xs">
              MESSAGES
            </h3>
            <div className="flex flex-col gap-4">
              <DynamicWeb3Inbox />
            </div>
          </section>
          <Separator className="my-4" />
        </>
      )}
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
    </div>
  )
}
