/* eslint-disable @typescript-eslint/naming-convention */
import AuthRedirect from "components/AuthRedirect"
import { Message } from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"
import { PlatformName } from "types"
import timeoutPromise from "utils/timeoutPromise"

const OAUTH_CONFIRMATION_TIMEOUT_MS = 500

export type OAuthResponse = {
  error_description?: string
  error?: string
  csrfToken: string
  platformName: PlatformName
} & Record<string, any>

export type OAuthLocalStorageInfo = {
  csrfToken: string
  from: string
  redirect_url: string
  scope: string
}

const getDataFromState = (
  state: string
): { csrfToken: string; platformName: PlatformName } => {
  if (!state) {
    return {} as { csrfToken: string; platformName: PlatformName }
  }
  const [platformName, csrfToken] = state.split("-")
  return { csrfToken, platformName: platformName as PlatformName }
}

const OAuth = () => {
  const router = useRouter()
  const { captureEvent } = usePostHogContext()
  const errorToast = useShowErrorToast()

  const handleOauthResponse = async () => {
    if (!router.isReady || typeof window === "undefined") return null

    let params: OAuthResponse
    if (
      typeof router.query?.state !== "string" &&
      typeof router.query?.oauth_token !== "string"
    ) {
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const { state, ...rest } = Object.fromEntries(fragment.entries())
      params = { ...getDataFromState(state), ...rest }
    } else {
      const { state, ...rest } = router.query
      params = { ...getDataFromState(state?.toString()), ...rest }
    }

    if (!params.oauth_token && (!params.csrfToken || !params.platformName)) {
      captureEvent("OAuth - No params found, or it is in invalid form", {
        params,
      })
      await router.push("/")
      return
    }

    const localStorageInfoKey = `${params.platformName ?? "TWITTER_V1"}_oauthinfo`
    const localStorageInfo: OAuthLocalStorageInfo = JSON.parse(
      window.localStorage.getItem(localStorageInfoKey) ?? "{}"
    )
    window.localStorage.removeItem(localStorageInfoKey)

    if (
      !params.oauth_token &&
      !!localStorageInfo.csrfToken &&
      localStorageInfo.csrfToken !== params.csrfToken
    ) {
      captureEvent(`OAuth - Invalid CSRF token`, {
        received: params.csrfToken,
        expected: localStorageInfo.csrfToken,
      })
      errorToast(`Failed to connect ${params.platformName}`)
      await router.push(localStorageInfo.from)
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
    if (params.error) {
      const { error, error_description: errorDescription } = params
      response = { type: "OAUTH_ERROR", data: { error, errorDescription } }
    } else {
      const { error, error_description, csrfToken, platformName, ...data } = params
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
      router.push(localStorageInfo.from)
    }
  }

  useEffect(() => {
    handleOauthResponse().catch((error) => {
      console.error(error)
      captureEvent("OAuth - Unexpected error", {
        error:
          error?.message ?? error?.toString?.() ?? JSON.stringify(error ?? null),
        trace: error?.stack,
      })
      errorToast(`An unexpected error happened while connecting a platform`)
      router.push("/")
    })
  }, [router])

  return <AuthRedirect />
}

export default OAuth
