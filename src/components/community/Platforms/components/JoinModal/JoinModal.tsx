import {
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
import { Link } from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import QRCode from "qrcode.react"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import useJoinModalMachine from "./hooks/useJoinModalMachine"
import platformsContent from "../../platformsContent"
import processSignError from "./utils/processSignError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const {
    join: { title, description },
  } = platformsContent[platform]
  const [state, send] = useJoinModalMachine(platform)

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={state.context.error} processError={processSignError} />
          {state.value !== "success" ? (
            <Text>{description}</Text>
          ) : (
            <VStack spacing="6">
              <Text>
                Here’s your link. It’s only active for 10 minutes and is only usable
                once:
              </Text>
              <Link
                href={state.context.inviteData.link}
                color="#006BFF"
                display="flex"
                isExternal
              >
                {state.context.inviteData.link}
                <ArrowSquareOut size="1.3em" weight="light" color="#006BFF" />
              </Link>
              <QRCode size={150} value={state.context.inviteData.link} />
              {!!state.context.inviteData.code && (
                <>
                  <Text>
                    If there’s lot of traffic right now, the bot might ask you for a
                    join code immediately after you land in the server. It’s usually
                    not the case, but if it is, here’s what you need:
                  </Text>
                  <Text fontWeight="700" fontSize="2xl" letterSpacing="5px">
                    {state.context.inviteData.code}
                  </Text>
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {(() => {
            switch (state.value) {
              default:
                return <ModalButton onClick={() => send("SIGN")}>Sign</ModalButton>
              case "signing":
                return <ModalButton isLoading loadingText="Waiting confirmation" />
              case "fetching":
                return (
                  <ModalButton isLoading loadingText="Generating your invite link" />
                )
              case "success":
                return <ModalButton onClick={onClose}>Done</ModalButton>
            }
          })()}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinModal
