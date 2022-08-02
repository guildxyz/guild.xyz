import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import { GoogleLogo } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useGoogleAuth from "../hooks/useGoogleAuth"
import ConnectedAccount from "./ConnectedAccount"

const GoogleAuthButton = (): JSX.Element => {
  const { platformUsers } = useUser()
  const googleFromDb = platformUsers?.some(
    (platformUser) => platformUser.platformName === "GOOGLE"
  )

  const { onOpen, code, state, redirectUri, isAuthenticating } = useGoogleAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (googleFromDb) return

    if (code && state && redirectUri)
      setValue("platforms.GOOGLE", {
        authData: { code, state, redirect_url: redirectUri },
      })
  }, [googleFromDb, code, state, redirectUri])

  if (googleFromDb || code)
    return (
      <ConnectedAccount icon={<GoogleLogo />}>Google connected</ConnectedAccount>
    )

  return (
    <ModalButton
      onClick={onOpen}
      colorScheme="blue"
      isLoading={isAuthenticating}
      loadingText={"Confirm in the pop-up"}
    >
      Connect Google
    </ModalButton>
  )
}

export default GoogleAuthButton
