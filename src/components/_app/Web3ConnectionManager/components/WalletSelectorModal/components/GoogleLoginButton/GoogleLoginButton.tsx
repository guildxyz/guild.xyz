import { Center, Img, Tag, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { connectorButtonProps } from "../ConnectorButton"
import UserAgentAlert from "./components/UserAgentAlert"
import UserOnboardingModal from "./components/UserOnboardingModal"

const GoogleLoginButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        onClick={onOpen}
        variant="ghost"
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
        rightIcon={<Tag ml="auto">Deprecated</Tag>}
        {...connectorButtonProps}
        sx={{
          ...connectorButtonProps.sx,
          "> .chakra-button__icon:last-child": {
            marginLeft: "auto!important",
          },
        }}
      >
        Google
      </Button>

      <UserAgentAlert />

      <UserOnboardingModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default GoogleLoginButton
