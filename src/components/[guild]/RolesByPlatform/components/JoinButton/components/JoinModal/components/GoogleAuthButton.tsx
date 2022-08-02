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

  const { onOpen, code, state, redirectUri, isAuthenticating } = useGoogleAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (googleFromDb) return

    if (code && state && redirectUri)
      setValue("platforms.GOOGLE", {
        authData: { code, state, redirect_url: redirectUri },
      })
  }, [googleFromDb, code, state, redirectUri])

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
