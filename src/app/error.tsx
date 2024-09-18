"use client" // Error components must be Client Components

import { Button } from "@/components/ui/Button"
import Bugsnag from "@bugsnag/js"
import { ChatCircle, House } from "@phosphor-icons/react/dist/ssr"
import { useEffect } from "react"
import GuildGhost from "static/avatars/58.svg"
import { triggerChat } from "utils/intercom"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Bugsnag.notify(error, (event) => {
      event.severity = "error"
      event.unhandled = true
    })
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <GuildGhost className="size-24" />

      <h2 className="font-black font-display text-6xl">Client-side error</h2>

      <p className="font-medium">{error.message}</p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <a href="/explorer">
          <Button colorScheme="primary" size="lg" leftIcon={<House weight="bold" />}>
            Go to home page
          </Button>
        </a>

        <Button
          size="lg"
          onClick={triggerChat}
          leftIcon={<ChatCircle weight="bold" />}
        >
          Contact support
        </Button>
      </div>
    </div>
  )
}
