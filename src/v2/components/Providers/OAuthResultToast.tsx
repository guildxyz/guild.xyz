"use client"

import { platformMergeAlertAtom } from "@/components/Providers/atoms"
import { useToast } from "@/components/ui/hooks/useToast"
import { useSetAtom } from "jotai"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import rewards from "rewards"
import { PlatformName } from "types"

export function OAuthResultToast() {
  const { toast } = useToast()

  const { replace } = useRouter()
  const pathname = usePathname()
  const readonlyQuery = useSearchParams()

  const showPlatformMergeAlert = useSetAtom(platformMergeAlertAtom)

  useEffect(() => {
    if (readonlyQuery?.get("oauth-status")) {
      const newQuery = new URLSearchParams(readonlyQuery.toString())

      const oauthPlatform = readonlyQuery.get("oauth-platform")
      const oauthStatus = readonlyQuery.get("oauth-status")
      const oauthMessage = readonlyQuery.get("oauth-message")

      const platformNameHumanReadable =
        rewards[(oauthPlatform as PlatformName) ?? ""]?.name ?? "Social"

      const title =
        oauthStatus === "success"
          ? `${platformNameHumanReadable} successfully connected`
          : `Failed to connect ${platformNameHumanReadable}`

      if (
        oauthStatus === "error" &&
        oauthMessage?.toString()?.startsWith("Before connecting your")
      ) {
        const [, addressOrDomain] = oauthMessage
          .toString()
          .match(
            /^Before connecting your (?:.*?) account, please disconnect it from this address: (.*?)$/
          )

        showPlatformMergeAlert({
          addressOrDomain,
          platformName: oauthPlatform as PlatformName,
        })
      } else {
        toast({
          variant: oauthStatus as "success" | "error",
          title,
          description: oauthMessage,
        })
      }

      replace(`${pathname}?${newQuery.toString()}`)
    }
    // replace is intentionally left out
    // toast is intentionally left out, as it causes the toast to fire twice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readonlyQuery, showPlatformMergeAlert, pathname])

  return null
}
