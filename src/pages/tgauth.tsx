import { useRouter } from "next/dist/client/router"
import Script from "next/script"
import { useEffect } from "react"

const TGAuth = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || !window.opener) return

    const telegramId = router.query.id

    const target = `${window.location.origin}${window.opener.location.pathname}`

    // I don't think we get an error message here?
    // if (error) {
    //   window.opener.postMessage(
    //     {
    //       type: "TG_AUTH_ERROR",
    //       data: { error, errorDescription },
    //     },
    //     target
    //   )
    //   return
    // }

    if (telegramId) {
      window.opener.postMessage(
        {
          type: "TG_AUTH_SUCCESS",
          data: {
            id: telegramId,
          },
        },
        target
      )
    }
  }, [router])

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/tgauth`

  if (typeof window === "undefined") return null

  return (
    <Script
      strategy="lazyOnload"
      src="https://telegram.org/js/telegram-widget.js?19"
      data-telegram-login="Guildxyz_bot"
      data-size="large"
      data-auth-url={redirectUri}
      data-request-access="write"
    />
  )
}
export default TGAuth
