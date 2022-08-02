import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import { TelegramLogo } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useTGAuth from "../hooks/useTGAuth"
import ConnectedAccount from "./ConnectedAccount"

const TelegramAuthButton = (): JSX.Element => {
  const { platformUsers } = useUser()

  const telegramFromDb = !!platformUsers?.some(
    (platform) => platform?.platformName === "TELEGRAM"
  )

  const { onOpen, telegramId, isAuthenticating, authData } = useTGAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (telegramFromDb) return

    if (authData) setValue("platforms.TELEGRAM", { authData })
  }, [authData, telegramFromDb])

  if (telegramFromDb || telegramId?.length > 0)
    return (
      <ConnectedAccount icon={<TelegramLogo />}>Telegram connected</ConnectedAccount>
    )

  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://telegram.org/js/telegram-widget.js?19"
      />
      <ModalButton
        onClick={onOpen}
        colorScheme="TELEGRAM"
        isLoading={isAuthenticating}
        loadingText={isAuthenticating && "Authenticate in the pop-up"}
      >
        Connect Telegram
      </ModalButton>
    </>
  )
}

export default TelegramAuthButton
