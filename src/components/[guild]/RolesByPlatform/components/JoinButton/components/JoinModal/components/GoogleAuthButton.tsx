import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import { Check, GoogleLogo } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useGoogleAuth from "../hooks/useGoogleAuth"

const GoogleAuthButton = (): JSX.Element => {
  const { platformUsers } = useUser()
  const googleFromDb = platformUsers?.some(
    (platformUser) => platformUser.platformName === "GOOGLE"
  )

  const { onOpen, code, isAuthenticating, signLoadingText } = useGoogleAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (googleFromDb) return

    if (code)
      setValue("platforms.GOOGLE", {
        authData: { code },
      })
  }, [googleFromDb, code])

  if (googleFromDb || code)
    return (
      <ModalButton
        as="div"
        colorScheme="gray"
        variant="solidStatic"
        rightIcon={<GoogleLogo />}
        leftIcon={<Check />}
        justifyContent="space-between"
        px="4"
      >
        Google connected
      </ModalButton>
    )

  return (
    <ModalButton
      onClick={onOpen}
      colorScheme="blue"
      isLoading={isAuthenticating}
      loadingText={isAuthenticating && (signLoadingText ?? "Confirm in the pop-up")}
    >
      Connect Google
    </ModalButton>
  )
}

export default GoogleAuthButton
