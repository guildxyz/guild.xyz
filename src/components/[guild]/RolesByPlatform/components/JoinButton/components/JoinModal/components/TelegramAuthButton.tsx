import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useTGAuth from "../hooks/useTGAuth"
import ConnectPlatform from "./ConnectPlatform"

const TelegramAuthButton = (): JSX.Element => {
  const { platformUsers } = useUser()

  const telegramFromDb = platformUsers?.find(
    (platform) => platform?.platformName === "TELEGRAM"
  )?.username

  const { onOpen, telegramId, isAuthenticating, authData } = useTGAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (telegramFromDb) return

    if (authData) setValue("platforms.TELEGRAM", { authData })
  }, [authData, telegramFromDb])

  return (
    <ConnectPlatform
      platform="TELEGRAM"
      isConnected={telegramFromDb || telegramId}
      onClick={onOpen}
      isLoading={isAuthenticating}
      loadingText={isAuthenticating && "Authenticate in the pop-up"}
    >
      <Script
        strategy="lazyOnload"
        src="https://telegram.org/js/telegram-widget.js?19"
      />
    </ConnectPlatform>
  )
}

export default TelegramAuthButton
