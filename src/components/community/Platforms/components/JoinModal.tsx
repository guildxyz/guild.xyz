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
import { Link } from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import { useState } from "react"
import QRCode from "qrcode.react"
import { Error } from "components/common/Error"
import { useCommunity } from "components/community/Context"
import type { SignErrorType } from "../hooks/usePersonalSign"
import { usePersonalSign } from "../hooks/usePersonalSign"
import platformsContent from "../platformsContent"
import processSignError from "../utils/processSignError"

type State = "initial" | "loading" | "success" | SignErrorType
type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}
type InviteData = {
  link: string
  code?: number
}

// ! This is a dummy function for the demo !
const getInviteLink = (
  platform: string,
  communityId: number,
  message: string
): InviteData => {
  // eslint-disable-next-line no-console
  console.log({ platform, communityId, message })
  return {
    link: "https://discord.gg/tfg3GYgu",
    code: 1235,
  }
}

const JoinModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const { id: communityId } = useCommunity()
  const [modalState, setModalState] = useState<State>("initial")
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const sign = usePersonalSign()
  const {
    join: { title, description },
  } = platformsContent[platform]

  const handleSign = () => {
    setModalState("loading")
    sign("Please sign this message to generate your invite link")
      .then((message) => {
        setInviteData(getInviteLink(platform, communityId, message))
        setModalState("success")
      })
      .catch((e) => {
        setModalState(e)
      })
  }

  const closeModal = () => {
    if (modalState !== "success") {
      setModalState("initial")
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={typeof modalState === "string" ? null : modalState}
            processError={processSignError}
          />
          {modalState !== "success" ? (
            <Text>{description}</Text>
          ) : (
            <VStack spacing="6">
              <Text>
                Here’s your link. It’s only active for 10 minutes and is only usable
                once:
              </Text>
              <Link href={inviteData.link} color="#006BFF" display="flex" isExternal>
                {inviteData.link}
                <ArrowSquareOut size="1.3em" weight="light" color="#006BFF" />
              </Link>
              <QRCode size={150} value={inviteData.link} />
              {!!inviteData.code && (
                <>
                  <Text>
                    If there’s lot of traffic right now, the bot might ask you for a
                    join code immediately after you land in the server. It’s usually
                    not the case, but if it is, here’s what you need:
                  </Text>
                  <Text fontWeight="700" fontSize="2xl" letterSpacing="5px">
                    {inviteData.code}
                  </Text>
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {modalState !== "success" ? (
            <Button
              isLoading={modalState === "loading"}
              loadingText="Waiting confirmation"
              w="100%"
              colorScheme="primary"
              size="lg"
              onClick={handleSign}
            >
              Sign
            </Button>
          ) : (
            <Button w="100%" colorScheme="primary" size="lg" onClick={onClose}>
              Done
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinModal
