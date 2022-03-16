import {
  Flex,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { CheckCircle } from "phosphor-react"
import platformsContent from "../../platformsContent"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent[""]
  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
  } = useJoinPlatform("", "")

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={joinError} processError={processJoinPlatformError} />
          {!response ? (
            <Text>{description}</Text>
          ) : response.alreadyJoined ? (
            <Flex alignItems="center">
              <Icon as={CheckCircle} color="green.500" boxSize="16" weight="light" />
              <Text ml="6">Seems like you've already joined!</Text>
            </Flex>
          ) : (
            <Flex alignItems="center">
              <Icon as={CheckCircle} color="green.500" boxSize="16" weight="light" />
              <Text ml="6">Successfully joined Guild!</Text>
            </Flex>
          )}
        </ModalBody>
        {(isSigning || isLoading || joinError || !response) && (
          <ModalFooter>
            {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
            <VStack spacing="0" alignItems="strech" w="full">
              {(() => {
                if (isSigning)
                  return <ModalButton isLoading loadingText="Check your wallet" />
                if (isLoading)
                  return <ModalButton isLoading loadingText="Joining guild" />
                if (joinError)
                  return <ModalButton onClick={onSubmit}>Try again</ModalButton>
                if (!response)
                  return <ModalButton onClick={onSubmit}>Verify address</ModalButton>
              })()}
            </VStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default JoinModal
