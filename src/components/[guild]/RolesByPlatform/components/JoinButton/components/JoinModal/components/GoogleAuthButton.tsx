import useUser from "components/[guild]/hooks/useUser"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useGoogleAuth from "../hooks/useGoogleAuth"
import ConnectPlatform from "./ConnectPlatform"

const GoogleAuthButton = (): JSX.Element => {
  const { platformUsers } = useUser()
  const googleFromDb = platformUsers?.find(
    (platformUser) => platformUser.platformName === "GOOGLE"
  )?.username

  const { onOpen, code, authData, isAuthenticating } = useGoogleAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (googleFromDb) return

    if (authData) setValue("platforms.GOOGLE", { authData })
  }, [googleFromDb, authData])

  return (
    <ConnectPlatform
      platform="GOOGLE"
      isConnected={googleFromDb || code}
      onClick={onOpen}
      isLoading={isAuthenticating}
      loadingText={"Confirm in the pop-up"}
    />
  )
}

export default GoogleAuthButton
