import { Center, Img, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import ExportWaaSModal from "./components/ExportWaaSModal"

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
        size="xl"
        w="full"
      >
        Export Google wallet
      </Button>

      <ExportWaaSModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default GoogleLoginButton
