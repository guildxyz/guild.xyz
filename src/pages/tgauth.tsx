import { Center } from "@chakra-ui/react"
import Button from "components/common/Button"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import Script from "next/script"
import { TelegramLogo } from "phosphor-react"
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

  const auth = () =>
    new Promise<boolean>((resolve, reject) => {
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
              reject()
            }
            window.opener.postMessage(
              {
                type: "TG_AUTH_SUCCESS",
                data,
              },
              router.query.openerOrigin
            )
            resolve(true)
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
        reject()
      }
    })

  const { isLoading, onSubmit } = useSubmit(auth)

  return (
    <Center h="100vh">
      <Script
        strategy="lazyOnload"
        src="https://telegram.org/js/telegram-widget.js?19"
      />

      <Button
        colorScheme={"telegram"}
        leftIcon={<TelegramLogo />}
        borderRadius="full"
        isLoading={isLoading}
        loadingText="Authenticate in the Telegram window"
        onClick={onSubmit}
      >
        Log in with Telegram
      </Button>
    </Center>
  )
}
export default TGAuth
