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
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import QRCode from "qrcode.react"
import platformsContent from "../../platformsContent"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
  roleId: number
}

const JoinTelegramModal = ({ isOpen, onClose, roleId }: Props): JSX.Element => {
  const { telegramId: telegramIdFromDb } = useUser()
  const {
    title,
    join: { description },
  } = platformsContent.TELEGRAM
  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
  } = useJoinPlatform("TELEGRAM", telegramIdFromDb?.toString(), roleId)

  // if both addressSignedMessage and TG is already known, submit useJoinPlatform on modal open
  /*useEffect(() => {
    if (isOpen && addressSignedMessage && telegramIdFromDb && !response) onSubmit()
  }, [isOpen])*/

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
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8">
              {response.alreadyJoined ? (
                <Flex alignItems="center">
                  <Icon
                    as={CheckCircle}
                    color="green.500"
                    boxSize="16"
                    weight="light"
                  />
                  <Text ml="6">
                    Seems like you've already joined the Telegram group!
                  </Text>
                </Flex>
              ) : (
                <>
                  <Text>Here’s your invite link:</Text>
                  <Link
                    maxW="full"
                    href={response.inviteLink}
                    colorScheme="blue"
                    isExternal
                  >
                    <Text width="full" as="span" isTruncated>
                      {response.inviteLink}
                    </Text>
                    <Icon as={ArrowSquareOut} mx="2" />
                  </Link>
                  <QRCode size={150} value={response.inviteLink} />
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
          <VStack spacing="0" alignItems="strech" w="full">
            {(() => {
              if (isSigning)
                return <ModalButton isLoading loadingText="Check your wallet" />
              if (isLoading)
                return <ModalButton isLoading loadingText="Generating invite link" />
              if (joinError)
                return <ModalButton onClick={onSubmit}>Try again</ModalButton>
              if (!response)
                return <ModalButton onClick={onSubmit}>Verify address</ModalButton>
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinTelegramModal
