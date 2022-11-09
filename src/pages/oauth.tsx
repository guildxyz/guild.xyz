import AuthRedirect from "components/AuthRedirect"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

type OAuthResponse = {
  error_description?: string
  error?: string
  state?: string
} & Record<string, any>

const OAuth = () => {
  const router = useRouter()
  const { addDatadogAction } = useDatadog()

  useEffect(() => {
    if (typeof window === "undefined") return

    const interval = setInterval(() => {
      try {
        const shouldClose = JSON.parse(
          window.localStorage.getItem("oauth_window_should_close")
        )
        if (shouldClose) {
          window.localStorage.removeItem("oauth_window_should_close")
          window.close()
        }
      } catch {}
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return

    // We navigate to the index page if the oauth page is used incorrectly
    // For example if someone just manually goes to /oauth

    let params: OAuthResponse = {}

    if (typeof router.query?.state !== "string") {
      if (!window.location.hash) router.push("/")
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      params = Object.fromEntries(fragment.entries())
    } else {
      params = router.query
    }

    if (Object.keys(params).length <= 0) router.push("/")

    if (params.error) {
      const { error, errorDescription } = params
      window.localStorage.setItem(
        "oauth_popup_data",
        JSON.stringify({
          type: "OAUTH_ERROR",
          data: { error, errorDescription },
        })
      )
      return
    }

    const csrfToken = params.state

    addDatadogAction(`CSRF - OAuth window recieved CSRF token: ${csrfToken}`)

    delete params.error
    delete params.error_description
    delete params.state

    window.localStorage.setItem(
      "oauth_popup_data",
      JSON.stringify({
        type: "OAUTH_SUCCESS",
        data: params,
        csrfToken,
      })
    )
  }, [router])

  return <AuthRedirect />
}
export default OAuth
