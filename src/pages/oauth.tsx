import AuthRedirect from "components/AuthRedirect"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

export type OAuthResponse = {
  error_description?: string
  error?: string
  csrfToken: string
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
      params = { csrfToken: state, ...rest }
    } else {
      const { state, ...rest } = router.query
      params = { csrfToken: state, ...rest }
    }

    addDatadogAction(`CSRF - OAuth window received CSRF token: ${params.csrfToken}`)

    // Navigate to home page, if opened incorrectly
    if (Object.keys(params).length <= 0) {
      await router.push("/")
    }

    // Open Broadcast Channel
    const channel = new BroadcastChannel(params.csrfToken)

    // Send response
    if (params.error) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { error, error_description } = params

      channel.postMessage({
        type: "OAUTH_ERROR",
        data: { error, errorDescription: error_description },
      })
    } else {
      delete params.error
      delete params.error_description
      delete params.csrfToken

      channel.postMessage({
        type: "OAUTH_SUCCESS",
        data: params,
      })
    }

    channel.close()
    window.close()
  }

  useEffect(() => {
    handleOauthResponse()
  }, [router])

  return <AuthRedirect />
}

export default OAuth
