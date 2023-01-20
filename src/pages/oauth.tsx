import AuthRedirect from "components/AuthRedirect"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useRouter } from "next/dist/client/router"
import { useEffect, useMemo } from "react"

type OAuthResponse = {
  error_description?: string
  error?: string
  state?: string
  csrfToken: string
  clientId: string
} & Record<string, any>

const OAuth = () => {
  const router = useRouter()
  const { addDatadogAction } = useDatadog()
  const params = useMemo<OAuthResponse>(() => {
    if (!router.isReady || typeof window === "undefined") return null
    if (typeof router.query?.state !== "string") {
      if (!window.location.hash) router.push("/")
      const fragment = new URLSearchParams(window.location.hash.slice(1))

      const [clientId, csrfToken] = fragment.get("state")?.split(";") ?? [
        undefined,
        undefined,
      ]

      return { ...Object.fromEntries(fragment.entries()), clientId, csrfToken }
    } else {
      const [clientId, csrfToken] = router.query.state?.split(";") ?? [
        undefined,
        undefined,
      ]

      return { ...router.query, clientId, csrfToken }
    }
  }, [router])

  useEffect(() => {
    if (typeof window === "undefined" || !params) return

    const shouldCloseKey = `oauth_window_should_close_${params.clientId}`

    const interval = setInterval(() => {
      try {
        const shouldClose = JSON.parse(window.localStorage.getItem(shouldCloseKey))
        if (shouldClose) {
          window.localStorage.removeItem(shouldCloseKey)
          window.close()
        }
      } catch {}
    }, 500)

    return () => clearInterval(interval)
  }, [params])

  useEffect(() => {
    if (!router.isReady || typeof window === "undefined" || !params) return

    if (Object.keys(params).length <= 0) router.push("/")

    const dataKey = `oauth_popup_data_${params.clientId}`

    if (params.error) {
      const { error, errorDescription } = params
      window.localStorage.setItem(
        dataKey,
        JSON.stringify({
          type: "OAUTH_ERROR",
          data: { error, errorDescription },
        })
      )
      return
    }

    addDatadogAction(`CSRF - OAuth window received CSRF token: ${params.csrfToken}`)

    delete params.error
    delete params.error_description
    delete params.state

    window.localStorage.setItem(
      dataKey,
      JSON.stringify({
        type: "OAUTH_SUCCESS",
        data: params,
        csrfToken: params.csrfToken,
      })
    )
  }, [router, params])

  return <AuthRedirect />
}
export default OAuth
