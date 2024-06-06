import { Center, Img } from "@chakra-ui/react"
import Button from "components/common/Button"
import { connectorButtonProps } from "../ConnectorButton"
import UserAgentAlert from "./components/UserAgentAlert"
import UserOnboardingModal from "./components/UserOnboardingModal"
import useLoginWithGoogle from "./hooks/useLoginWithGoogle"

const GoogleLoginButton = () => {
  const {
    isNewWallet,
    isOpen,
    onClose,
    isLoading,
    onSubmit,
    response,
    isGoogleAuthLoading,
  } = useLoginWithGoogle()

  return (
    <>
      <UserAgentAlert />

      <Button
        isLoading={isLoading}
        onClick={onSubmit}
        colorScheme="white"
        borderWidth="2px"
        leftIcon={
          <Center boxSize={6}>
            <Img
              src={`/walletLogos/google.svg`}
              maxW={6}
              maxH={6}
              alt={`Google logo`}
            />
          </Center>
        }
        loadingText={isGoogleAuthLoading ? "Confirm in popup..." : "Loading"}
        {...connectorButtonProps}
      >
        Google (deprecated)
      </Button>

      <UserOnboardingModal
        isNewWallet={isNewWallet}
        isOpen={isOpen}
        onClose={onClose}
        isLoginLoading={isLoading}
        isLoginSuccess={!!response}
      />
    </>
  )
}

export default GoogleLoginButton
