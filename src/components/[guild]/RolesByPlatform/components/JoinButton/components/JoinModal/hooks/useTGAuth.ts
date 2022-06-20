import { useState } from "react"
import { WindowTelegram } from "types"

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
