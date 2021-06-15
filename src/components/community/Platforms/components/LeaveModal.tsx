import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import { useWeb3React } from "@web3-react/core"
import platformsContent from "../platformsContent"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const LeaveModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const { id: communityId } = useCommunity()
  const { account } = useWeb3React()
  const {
    leave: { title, membershipDescription, leaveDescription, buttonText },
  } = platformsContent[platform]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5}>
            <Text>{membershipDescription}</Text>
            <Text>{leaveDescription}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            w="100%"
            colorScheme="primary"
            size="lg"
            // eslint-disable-next-line no-console
            onClick={() => console.log({ address: account, platform, communityId })}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
