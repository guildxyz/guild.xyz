"use client"

import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import type { Message } from "@/hooks/useOauthPopupWindow"
import { PlatformName } from "@guildxyz/types"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import timeoutPromise from "utils/timeoutPromise"
import { OAuthLocalStorageInfo, OAuthResponse } from "./types"

const OAUTH_CONFIRMATION_TIMEOUT_MS = 500

const getDataFromState = (
  state: string
): { csrfToken: string; platformName: PlatformName } => {
  if (!state) {
    return {} as { csrfToken: string; platformName: PlatformName }
  }
  const [platformName, csrfToken] = state.split("-")
  return { csrfToken, platformName: platformName as PlatformName }
}

const OAuthPage = ({ searchParams }: { searchParams: Record<string, string> }) => {
  const { push } = useRouter()
  const { captureEvent } = usePostHogContext()
  const errorToast = useErrorToast()

  const handleOauthResponse = useCallback(async () => {
    if (typeof window === "undefined") return null

    let params: OAuthResponse
    if (
      typeof searchParams?.state !== "string" &&
      typeof searchParams?.oauth_token !== "string" &&
      typeof searchParams?.denied !== "string"
    ) {
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const { state, ...rest } = Object.fromEntries(fragment.entries())
      params = { ...getDataFromState(state), ...rest }
    } else {
      const { state, ...rest } = searchParams
      params = { ...getDataFromState(state?.toString()), ...rest }
    }

    if (
      !params.oauth_token &&
      !params.denied &&
      (!params.csrfToken || !params.platformName)
    ) {
      captureEvent("OAuth - No params found, or it is in invalid form", {
        params,
      })
      await push("/")
      return
    }

    const localStorageInfoKey = `${params.platformName ?? "TWITTER_V1"}_oauthinfo`
    const localStorageInfo: OAuthLocalStorageInfo = JSON.parse(
      window.localStorage.getItem(localStorageInfoKey) ?? "{}"
    )
    window.localStorage.removeItem(localStorageInfoKey)

    if (
      !params.oauth_token &&
      !params.denied &&
      !!localStorageInfo.csrfToken &&
      localStorageInfo.csrfToken !== params.csrfToken
    ) {
      captureEvent(`OAuth - Invalid CSRF token`, {
        received: params.csrfToken,
        expected: localStorageInfo.csrfToken,
      })
      errorToast(`Failed to connect ${params.platformName}`)
      await push(localStorageInfo.from)
      return
    }

    const channel = new BroadcastChannel(
      !params.platformName ? "TWITTER_V1" : params.csrfToken
    )

    const isMessageConfirmed = timeoutPromise(
      new Promise<void>((resolve) => {
        channel.onmessage = () => resolve()
      }),
      OAUTH_CONFIRMATION_TIMEOUT_MS
    )
      .then(() => true)
      .catch(() => false)

    let response: Message
    if (params.denied) {
      response = {
        type: "OAUTH_ERROR",
        data: {
          error: "Rejected",
          errorDescription: "Authorization request has been rejected",
        },
      }
    } else if (params.error) {
      const { error, error_description: errorDescription } = params
      response = {
        type: "OAUTH_ERROR",
        data: {
          error: error ?? "Unknown error",
          errorDescription: errorDescription ?? "Unknown error",
        },
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { error, error_description, csrfToken, platformName, ...data } = params
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { csrfToken: _csrfToken, from, ...infoRest } = localStorageInfo
      response = { type: "OAUTH_SUCCESS", data: { ...data, ...infoRest } }
    }

    channel.postMessage(response)

    const isReceived = await isMessageConfirmed

    if (isReceived) {
      channel.close()
      window.close()
    } else {
      localStorage.setItem(
        `${params.platformName ?? "TWITTER_V1"}_shouldConnect`,
        JSON.stringify(response)
      )
      push(localStorageInfo.from)
    }
  }, [captureEvent, errorToast, push, searchParams])

  useEffect(() => {
    handleOauthResponse().catch((error) => {
      console.error(error)
      captureEvent("OAuth - Unexpected error", {
        error:
          error?.message ?? error?.toString?.() ?? JSON.stringify(error ?? null),
        trace: error?.stack,
      })
      errorToast(`An unexpected error happened while connecting a platform`)
      push("/")
    })
  }, [captureEvent, errorToast, handleOauthResponse, push])

  return (
    <div className="flex h-[90vh] flex-col justify-center p-10 text-center">
      <h1 className="mb-3 font-bold text-2xl">You're being redirected</h1>
      <p>Closing the authentication window and taking you back to the site...</p>
    </div>
  )
}

export default OAuthPage
