/* eslint-disable @typescript-eslint/naming-convention */
import AuthRedirect from "components/AuthRedirect"
import { Message } from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"
import { PlatformName } from "types"
import timeoutPromise from "utils/timeoutPromise"

const OAUTH_CONFIRMATION_TIMEOUT_MS = 500

export type OAuthResponse = {
  error_description?: string
  error?: string
  csrfToken: string
  from: string
  platformName: PlatformName
  redirect_url: string
  scope: string
} & Record<string, any>

const OAuth = () => {
  const router = useRouter()
  const { addDatadogAction } = useDatadog()

  const handleOauthResponse = async () => {
    if (!router.isReady || typeof window === "undefined") return null

    // Parse params
    let params: OAuthResponse
    if (typeof router.query?.state !== "string") {
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const { state, ...rest } = Object.fromEntries(fragment.entries())
      params = { ...JSON.parse(decodeURIComponent(state)), ...rest }
    } else {
      const { state, ...rest } = router.query
      params = { ...JSON.parse(decodeURIComponent(state)), ...rest }
    }

    addDatadogAction(`CSRF - OAuth window received CSRF token: ${params.csrfToken}`)

    // Navigate to home page, if opened incorrectly
    if (Object.keys(params).length <= 0) {
      await router.push("/")
    }

    // Open Broadcast Channel
    const channel = new BroadcastChannel(params.csrfToken)

    const isMessageConfirmed = timeoutPromise(
      new Promise<void>((resolve) => {
        channel.onmessage = () => resolve()
      }),
      OAUTH_CONFIRMATION_TIMEOUT_MS
    )
      .then(() => true)
      .catch(() => false)

    // Send response
    let response: Message
    if (params.error) {
      const { error, error_description: errorDescription } = params
      response = { type: "OAUTH_ERROR", data: { error, errorDescription } }
    } else {
      const { error, error_description, csrfToken, from, platformName, ...data } =
        params
      response = { type: "OAUTH_SUCCESS", data }
    }

    channel.postMessage(response)

    const isReceived = await isMessageConfirmed

    // TODO: isRecieved could be false because of wrong CSRF token

    if (isReceived) {
      channel.close()
      window.close()
    } else {
      localStorage.setItem(
        `${params.platformName}_shouldConnect`,
        JSON.stringify(response)
      )
      router.push(params.from)
    }
  }

  useEffect(() => {
    handleOauthResponse()
  }, [router])

  return <AuthRedirect />
}

export default OAuth
