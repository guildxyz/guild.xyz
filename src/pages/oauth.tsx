import AuthRedirect from "components/AuthRedirect"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

// clientId,scrfToken
type OauthState = [string | number, string]

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

    let code = null
    let error = null
    let errorDescription = null
    let clientId = null
    let csrfToken = null

    if (typeof router.query?.state !== "string") {
      if (!window.location.hash) router.push("/")
      const fragment = new URLSearchParams(window.location.hash.slice(1))

      if (
        !fragment.has("state") ||
        (!fragment.has("code") &&
          (!fragment.has("error") || !fragment.has("error_description")))
      )
        router.push("/")

      code = fragment.get("code")
      error = fragment.get("error")
      errorDescription = fragment.get("error_description")
      const state = fragment.get("state").split(";") as OauthState
      clientId = state[0]
      csrfToken = state[1]
    } else {
      code = router.query.code
      error = router.query.error
      errorDescription = router.query.error_description
      const state = (router.query.state as string).split(";") as OauthState
      clientId = state[0]
      csrfToken = state[1]
    }

    if (error) {
      window.localStorage.setItem(
        "oauth_popup_data",
        JSON.stringify({
          type: "OAUTH_ERROR",
          data: { error, errorDescription },
        })
      )
      return
    }

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

    window.localStorage.setItem(
      "oauth_popup_data",
      JSON.stringify({
        type: "OAUTH_SUCCESS",
        data: code,
      })
    )
  }, [router])

  return <AuthRedirect />
}
export default OAuth
