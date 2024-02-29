import { Center } from "@chakra-ui/react"
import Button from "components/common/Button"
import usePopupWindow from "hooks/usePopupWindow"
import { TelegramLogo } from "phosphor-react"
import { useEffect } from "react"
import timeoutPromise from "utils/timeoutPromise"

const TG_CONFIRMATION_TIMEOUT_MS = 500

async function postBackResult(data) {
  const result =
    !data || !("result" in data)
      ? {
          type: "OAUTH_ERROR",
          data: {
            error: "Unknown error",
            errorDescription: "Unknown error",
          },
        }
      : { type: "OAUTH_SUCCESS", data: data.result }

  const channel = new BroadcastChannel("TELEGRAM")

  const isMessageConfirmed = timeoutPromise(
    new Promise<void>((resolve) => {
      channel.onmessage = () => resolve()
    }),
    TG_CONFIRMATION_TIMEOUT_MS
  )
    .then(() => true)
    .catch(() => false)

  channel.postMessage(result)

  const isReceived = await isMessageConfirmed

  const origin = typeof window === "undefined" ? "https://guild.xyz" : window.origin

  if (isReceived) {
    channel.close()
    window.close()
  } else {
    localStorage.setItem(`${"TELEGRAM"}_shouldConnect`, JSON.stringify(result))
    window.location.href = `${origin}/explorer`
  }
}

const TGAuth = () => {
  const origin = typeof window === "undefined" ? "https://guild.xyz" : window.origin
  const url = `https://oauth.telegram.org/auth?bot_id=${process.env.NEXT_PUBLIC_TG_BOT_ID}&origin=${origin}&request_access=write&lang=en&return_to=${origin}/tgauth`
  const { onOpen } = usePopupWindow(url)

  const onClick =
    typeof window !== "undefined" && window.opener
      ? onOpen
      : () => {
          window.location.href = url
        }

  useEffect(() => {
    // Handle case when the popup sends data in URL fragments
    {
      const hash = new URLSearchParams(window.location.hash?.slice(1) ?? "")
      const hasTgAuthResult = hash.has("tgAuthResult")

      if (hasTgAuthResult) {
        const stringData = Buffer.from(hash.get("tgAuthResult"), "base64").toString()
        const parsed = JSON.parse(stringData)
        postBackResult(parsed)
        return
      }
    }

    // Handle case when the popup sends the data in window event
    const listener = (event: MessageEvent<any>) => {
      if (
        event.isTrusted &&
        event.origin === "https://oauth.telegram.org" &&
        typeof event.data === "string"
      ) {
        const parsed = JSON.parse(event.data)
        postBackResult(parsed)
      }
    }

    window.addEventListener("message", listener)

    return () => {
      window.removeEventListener("message", listener)
    }
  }, [])

  return (
    <Center h="100vh">
      <Button
        colorScheme={"telegram"}
        leftIcon={<TelegramLogo />}
        borderRadius="full"
        loadingText="Authenticate in the Telegram window"
        onClick={onClick}
      >
        Log in with Telegram
      </Button>
    </Center>
  )
}

export default TGAuth
