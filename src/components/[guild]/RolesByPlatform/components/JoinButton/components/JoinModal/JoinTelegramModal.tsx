import {
  CloseButton,
  Collapse,
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
import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import { Check } from "phosphor-react"
import { useState } from "react"
import platformsContent from "../../platformsContent"
import InviteLink from "./components/InviteLink"
import useJoinPlatform from "./hooks/useJoinPlatform"
import useTGAuth from "./hooks/useTGAuth"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinTelegramModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent.TELEGRAM
  const { telegramId: telegramIdFromDb } = useUser()

  const { onOpen, telegramId, error, isAuthenticating } = useTGAuth()

  const [hideTGAuthNotification, setHideTGAuthNotification] = useState(false)

  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
  } = useJoinPlatform(
    "TELEGRAM",
    telegramIdFromDb ? telegramIdFromDb?.toString() : telegramId
  )

  const handleSubmit = () => {
    setHideTGAuthNotification(true)
    onSubmit()
  }
  const handleClose = () => {
    setHideTGAuthNotification(true)
    onClose()
  }

  // if both addressSignedMessage and TG is already known, submit useJoinPlatform on modal open
  /*useEffect(() => {
    if (isOpen && addressSignedMessage && telegramIdFromDb && !response) onSubmit()
  }, [isOpen])*/

  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://telegram.org/js/telegram-widget.js?19"
      />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join {title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error
              error={error || joinError}
              processError={processJoinPlatformError}
            />
            {!response ? (
              <Text>{description}</Text>
            ) : (
              /** Negative margin bottom to offset the Footer's padding that's there anyway */
              <VStack spacing="6" mb="-8" alignItems="left">
                <InviteLink inviteLink={response.inviteLink} />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
            <VStack spacing="0" alignItems="strech" w="full">
              {!telegramIdFromDb &&
                (telegramId?.length > 0 ? (
                  <Collapse in={!hideTGAuthNotification} unmountOnExit>
                    <ModalButton
                      mb="3"
                      as="div"
                      colorScheme="gray"
                      variant="solidStatic"
                      rightIcon={
                        <CloseButton
                          onClick={() => setHideTGAuthNotification(true)}
                        />
                      }
                      leftIcon={<Check />}
                      justifyContent="space-between"
                      px="4"
                    >
                      <Text title="Authentication successful" isTruncated>
                        Authentication successful
                      </Text>
                    </ModalButton>
                  </Collapse>
                ) : (
                  <ModalButton
                    mb="3"
                    onClick={onOpen}
                    isLoading={isAuthenticating}
                    loadingText={isAuthenticating && "Authenticate in the pop-up"}
                  >
                    Connect Telegram
                  </ModalButton>
                ))}

              {!response &&
                (() => {
                  if (isSigning)
                    return <ModalButton isLoading loadingText="Check your wallet" />
                  if (isLoading)
                    return (
                      <ModalButton isLoading loadingText="Generating invite link" />
                    )
                  if (joinError)
                    return (
                      <ModalButton onClick={handleSubmit}>Try again</ModalButton>
                    )
                  if (!response)
                    return (
                      <ModalButton onClick={handleSubmit}>
                        Verify address
                      </ModalButton>
                    )
                })()}
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default JoinTelegramModal
