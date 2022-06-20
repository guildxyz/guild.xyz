import { useState } from "react"

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

const useTGAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [telegramId, setTelegramId] = useState<string>(null)
  const [error, setError] = useState(null)

  const windowAsAny = typeof window !== "undefined" && (window as any)
  const windowTelegram = windowAsAny.Telegram
    ? (windowAsAny.Telegram as WindowTelegram)
    : undefined

  const handleAuth = () => {
    setIsAuthenticating(true)
    setError(null)

    try {
      windowTelegram?.Login?.auth(
        {
          bot_id: "5090498030",
          lang: "en",
          request_access: "write",
        },
        (data) => {
          if (data) setTelegramId(data?.id?.toString())
        }
      )
    } catch (_) {
      setError({
        error: "Error",
        errorDescription: "Telegram auth widget error.",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  return {
    telegramId,
    error,
    onOpen: handleAuth,
    isAuthenticating,
  }
}

export default useTGAuth
