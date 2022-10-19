import AuthRedirect from "components/AuthRedirect"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

type OAuthResponse = {
  error_description?: string
  error?: string
  state?: string
} & Record<string, any>

const OAuth = () => {
  const router = useRouter()

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

    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth

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

    const [clientId, csrfToken] = params.state?.split(";") ?? [undefined, undefined]

    const csrfTokenStorageKey = `oauth_csrf_token_${clientId}`

    if (csrfToken !== JSON.parse(window.localStorage.getItem(csrfTokenStorageKey))) {
      window.localStorage.setItem(
        "oauth_popup_data",
        JSON.stringify({
          type: "OAUTH_ERROR",
          data: {
            error: "CSRF Error",
            errorDescription:
              "CSRF token mismatch, this indicates possible csrf attack.",
          },
        })
      )
      return
    } else {
      window.localStorage.removeItem(csrfTokenStorageKey)
    }

    delete params.error
    delete params.error_description
    delete params.state

    window.localStorage.setItem(
      "oauth_popup_data",
      JSON.stringify({
        type: "OAUTH_SUCCESS",
        data: params,
      })
    )
  }, [router])

  return <AuthRedirect />
}
export default OAuth
