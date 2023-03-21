/* eslint-disable @typescript-eslint/naming-convention */
import AuthRedirect from "components/AuthRedirect"
import { Message } from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import useDatadog from "components/_app/Datadog/useDatadog"
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
} & Record<string, any>

export type OAuthLocalStorageInfo = {
  csrfToken: string
  from: string
  platformName: PlatformName
  redirect_url: string
  scope: string
}

const OAuth = () => {
  const router = useRouter()
  const { addDatadogAction, addDatadogError } = useDatadog()
  const errorToast = useShowErrorToast()

  const handleOauthResponse = async () => {
    if (!router.isReady || typeof window === "undefined") return null

    let params: OAuthResponse
    if (typeof router.query?.state !== "string") {
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const { state, ...rest } = Object.fromEntries(fragment.entries())
      params = { csrfToken: decodeURIComponent(state), ...rest }
    } else {
      const { state, ...rest } = router.query
      params = { csrfToken: decodeURIComponent(state), ...rest }
    }

    if (Object.keys(params).length <= 0) {
      await router.push("/")
      return
    }

    const localStorageInfoKey = `oauth_${params.csrfToken}`
    const localStorageInfo: OAuthLocalStorageInfo = JSON.parse(
      window.localStorage.getItem(localStorageInfoKey) ?? "{}"
    )
    window.localStorage.removeItem(localStorageInfoKey)

    if (
      !!localStorageInfo.csrfToken &&
      localStorageInfo.csrfToken !== params.csrfToken
    ) {
      addDatadogError(`OAuth - Invalid CSRF token`, {
        received: params.csrfToken,
        expected: localStorageInfo.csrfToken,
      })
      errorToast(`Failed to connect ${params.platformName}`)
      await router.push(params.from)
      return
    }

    const channel = new BroadcastChannel(params.csrfToken)

    const isMessageConfirmed = timeoutPromise(
      new Promise<void>((resolve) => {
        channel.onmessage = () => resolve()
      }),
      OAUTH_CONFIRMATION_TIMEOUT_MS
    )
      .then(() => true)
      .catch(() => {
        addDatadogAction(`OAuth - Message confirmation timed out`)
        return false
      })

    let response: Message
    if (params.error) {
      const { error, error_description: errorDescription } = params
      response = { type: "OAUTH_ERROR", data: { error, errorDescription } }
    } else {
      const { error, error_description, csrfToken, ...data } = params
      const {
        csrfToken: _csrfToken,
        from,
        platformName,
        ...infoRest
      } = localStorageInfo
      response = { type: "OAUTH_SUCCESS", data: { ...data, ...infoRest } }
    }

    channel.postMessage(response)

    const isReceived = await isMessageConfirmed

    if (isReceived) {
      channel.close()
      window.close()
    } else {
      localStorage.setItem(
        `${localStorageInfo.platformName}_shouldConnect`,
        JSON.stringify(response)
      )
      router.push(localStorageInfo.from)
    }
  }

  useEffect(() => {
    handleOauthResponse().catch((error) => {
      addDatadogError("OAuth - Unexpected error", error)
      // errorToast(`An unexpected error happened while connecting a platform`)
      errorToast(
        error?.message ??
          error?.toString?.() ??
          JSON.stringify(error ?? "Unknown error")
      )
      router.push("/")
    })
  }, [router])

  return <AuthRedirect />
}

export default OAuth
