import {
  Collapse,
  HStack,
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
import useUser from "components/[guild]/hooks/useUser"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import { CheckCircle } from "phosphor-react"
import { useEffect, useState } from "react"
import platformsContent from "../../platformsContent"
import InviteLink from "./components/InviteLink"
import useDCAuth, { fetcherWithDCAuth } from "./hooks/useDCAuth"
import useJoinPlatform, { JoinPlatformData } from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinDiscordModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent.DISCORD
  const router = useRouter()

  const { onOpen, authorization, error, isAuthenticating } = useDCAuth("identify")
  const {
    response: dcUserId,
    isLoading: isFetchingUserId,
    onSubmit: fetchUserId,
    error: dcUserIdError,
  } = useSubmit(() =>
    fetcherWithDCAuth(authorization, "https://discord.com/api/users/@me").then(
      (res) => res.id
    )
  )
  useEffect(() => {
    if (authorization?.length > 0) fetchUserId()
  }, [authorization])

  const [hideDCAuthNotification, setHideDCAuthNotification] = useState(
    !!authorization
  )

  const user = useUser()
  const isDiscordConnected = user?.platformUsers?.some(
    (platformUser) => platformUser.platformName === "DISCORD"
  )

  const joinPlatformData: JoinPlatformData =
    router.query.platform === "discord" && typeof router.query.hash === "string"
      ? { hash: router.query.hash }
      : { authData: { access_token: authorization?.split(" ")?.[1] } }

  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
  } = useJoinPlatform("DISCORD", isDiscordConnected ? undefined : joinPlatformData)

  const handleSubmit = () => {
    setHideDCAuthNotification(true)
    onSubmit()
  }
  const handleClose = () => {
    setHideDCAuthNotification(true)
    onClose()
  }

  // if addressSignedMessage is already known, submit useJoinPlatform on DC auth
  /* useEffect(() => {
    if (
      authState.matches({ idKnown: "successNotification" }) &&
      addressSignedMessage
    )
      onSubmit()
  }, [authState]) */

  // if both addressSignedMessage and DC is already known, submit useJoinPlatform on modal open
  /* useEffect(() => {
    if (isOpen && addressSignedMessage && authState.matches("idKnown") && !response)
      onSubmit()
  }, [isOpen]) */

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={error || joinError || dcUserIdError}
            processError={processJoinPlatformError}
          />
          {!response ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8" alignItems="left">
              {
                // Explicit true check for type association
                response?.platformResults?.[0]?.success === true ? (
                  <HStack spacing={6}>
                    <Icon
                      as={CheckCircle}
                      color="green.500"
                      boxSize="16"
                      weight="light"
                    />
                    <Text>
                      Seems like you've already joined the Discord server, you should
                      get access to the correct channels soon!
                    </Text>
                  </HStack>
                ) : (
                  <InviteLink inviteLink={response?.platformResults?.[0]?.invite} />
                )
              }
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
          <VStack spacing="0" alignItems="strech" w="full">
            {dcUserId?.length > 0 && !!authorization ? (
              <Collapse in={!hideDCAuthNotification} unmountOnExit>
                <ModalButton
                  mb="3"
                  onClick={onOpen}
                  colorScheme="DISCORD"
                  isLoading={isAuthenticating || isFetchingUserId}
                  loadingText={isAuthenticating && "Confirm in the pop-up"}
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
                isLoading={isAuthenticating || isFetchingUserId}
                loadingText={isAuthenticating && "Confirm in the pop-up"}
              >
                Connect Discord
              </ModalButton>
            )}

            {!response &&
              (() => {
                if (
                  !authorization &&
                  !dcUserId &&
                  !(router.query.hash && router.query.platform === "discord")
                )
                  return (
                    <ModalButton disabled colorScheme="gray">
                      Verify address
                    </ModalButton>
                  )
                if (isSigning)
                  return <ModalButton isLoading loadingText="Check your wallet" />
                if (isLoading)
                  return (
                    <ModalButton isLoading loadingText="Generating invite link" />
                  )
                return (
                  <ModalButton onClick={handleSubmit}>Verify address</ModalButton>
                )
              })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
