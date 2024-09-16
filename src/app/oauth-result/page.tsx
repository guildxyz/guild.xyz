"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import rewards from "rewards"
import { OAuthResultParams } from "./types"

const OauthResultPage = ({ searchParams }: { searchParams: OAuthResultParams }) => {
  const { push } = useRouter()
  const [hasReceivedConfirmation, setHasReceivedConfirmation] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (searchParams.platform) {
      const channel = new BroadcastChannel(`guild-${searchParams.platform}`)
      channel.onmessage = (event) => {
        if (
          event.isTrusted &&
          event.origin === window.origin &&
          event.data?.type === "oauth-confirmation"
        ) {
          setHasReceivedConfirmation(true)
          window.close()
          if (timeout) {
            clearTimeout(timeout)
          }
        }
      }

      channel.postMessage(searchParams)
    }

    if ("path" in searchParams) {
      timeout = setTimeout(() => {
        const params = new URLSearchParams({
          "oauth-platform": searchParams.platform as string,
          "oauth-status": searchParams.status as string,
          ...("message" in searchParams
            ? { "oauth-message": searchParams.message }
            : {}),
        }).toString()

        push(`${searchParams.path}?${params}`)
      }, 1000)
    }
  }, [searchParams, push])

  const rewardConfig =
    searchParams.platform && searchParams.platform in rewards
      ? rewards[searchParams.platform as keyof typeof rewards]
      : undefined

  return (
    <div className="flex h-[90vh] flex-col justify-center p-10 text-center">
      <h1 className="mb-3 font-bold text-2xl">
        {searchParams.status === "success"
          ? `${rewardConfig?.name} successfully conneted!`
          : searchParams.platform
            ? `${rewardConfig?.name} connection failed`
            : "Connection unsuccessful"}
      </h1>
      <p>
        {searchParams.status === "success"
          ? hasReceivedConfirmation
            ? "You may now close this window"
            : "Taking you back to Guild"
          : searchParams.message}
      </p>
    </div>
  )
}

export default OauthResultPage
