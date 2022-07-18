import { Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Script from "next/script"
import { useEffect } from "react"

type WindowTelegram = {
  Login: {
    auth: (
      options: {
        bot_id: string
        request_access?: string
        lang?: string
      },
      callback: (
        dataOrFalse:
          | {
              auth_date: number
              first_name: string
              hash: string
              id: number
              last_name: string
              username: string
            }
          | false
      ) => void
    ) => void
  }
}

const TGAuth = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || !window.opener) return
  }, [router])

  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://telegram.org/js/telegram-widget.js?19"
      />

      <Button
        onClick={() => {
          console.log(router)
          try {
            ;(
              window as Window & typeof globalThis & { Telegram: WindowTelegram }
            )?.Telegram?.Login?.auth(
              {
                bot_id: process.env.NEXT_PUBLIC_TG_BOT_ID,
                lang: "en",
                request_access: "write",
              },
              (data) => {
                if (data === false) {
                  window.opener.postMessage(
                    {
                      type: "TG_AUTH_ERROR",
                      data: {
                        error: "Authentication error",
                        errorDescription:
                          "Something went wrong with Telegram authentication, please try again",
                      },
                    },
                    router.query.openerOrigin
                  )
                }
                window.opener.postMessage(
                  {
                    type: "TG_AUTH_SUCCESS",
                    data,
                  },
                  router.query.openerOrigin
                )
              }
            )
          } catch (_) {
            window.opener.postMessage(
              {
                type: "TG_AUTH_ERROR",
                data: {
                  error: "Error",
                  errorDescription: "Telegram auth widget error.",
                },
              },
              router.query.openerOrigin
            )
          }
        }}
      >
        Authenticate
      </Button>
    </>
  )
}
export default TGAuth
