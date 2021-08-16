import {
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
import Modal from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { ArrowSquareOut } from "phosphor-react"
import QRCode from "qrcode.react"
import React from "react"
import platformsContent from "../../platformsContent"
import useJoinDiscordMachine from "./hooks/useJoinDiscordMachine"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const JoinDiscordModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent[platform]
  const [state, send] = useJoinDiscordMachine()

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={processJoinPlatformError}
          />
          {state.value !== "success" ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8">
              {state.context.inviteData.alreadyJoined ? (
                <Text>
                  Seems like you've already joined the Discord server, you should get
                  access to the correct channels soon!
                </Text>
              ) : (
                <>
                  <Text>Here’s your invite link:</Text>
                  <Link
                    href={state.context.inviteData.inviteLink}
                    colorScheme="blue"
                    isExternal
                  >
                    {state.context.inviteData.inviteLink}
                    <Icon as={ArrowSquareOut} mx="2" />
                  </Link>
                  <QRCode size={150} value={state.context.inviteData.inviteLink} />
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {(() => {
            switch (state.value) {
              case "signing":
                return <ModalButton isLoading loadingText="Waiting confirmation" />
              case "authenticating":
                return (
                  <ModalButton isLoading loadingText="Waiting for authentication" />
                )
              case "fetching":
                return <ModalButton isLoading loadingText="Generating invite link" />
              case "success":
                return null
              case "authIdle":
              case "authError":
                return (
                  <ModalButton onClick={() => send("AUTH")}>
                    Authenticate
                  </ModalButton>
                )
              case "idle":
              case "signError":
              default:
                return <ModalButton onClick={() => send("SIGN")}>Sign</ModalButton>
            }
          })()}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
