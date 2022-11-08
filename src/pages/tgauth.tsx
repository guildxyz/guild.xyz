import { Center } from "@chakra-ui/react"
import Button from "components/common/Button"
import useDatadog from "components/_app/Datadog/useDatadog"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import Script from "next/script"
import { TelegramLogo } from "phosphor-react"

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

  const { addDatadogAction, addDatadogError } = useDatadog()

  const auth = () =>
    new Promise<boolean>((resolve, reject) => {
      try {
        const windowTelegram = (
          window as Window & typeof globalThis & { Telegram: WindowTelegram }
        )?.Telegram
        const telegramAuth = windowTelegram.Login?.auth

        if (typeof telegramAuth !== "function") {
          addDatadogError("Telegram login widget error.", { windowTelegram })
          reject("Telegram login widget error.")
        }

        telegramAuth(
          {
            bot_id: process.env.NEXT_PUBLIC_TG_BOT_ID,
            lang: "en",
            request_access: "write",
          },
          (data) => {
            if (data === false) {
              addDatadogAction("TG_AUTH_ERROR")
              window.opener?.postMessage(
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
            } else {
              addDatadogAction("TG_AUTH_SUCCESS", { data })
              window.opener?.postMessage(
                {
                  type: "TG_AUTH_SUCCESS",
                  data,
                },
                router.query.openerOrigin
              )
              resolve(true)
            }
          }
        )
      } catch (tgAuthErr) {
        addDatadogError("tgauth:catch", { error: tgAuthErr })
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
      <Script src="https://telegram.org/js/telegram-widget.js?19" />
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
