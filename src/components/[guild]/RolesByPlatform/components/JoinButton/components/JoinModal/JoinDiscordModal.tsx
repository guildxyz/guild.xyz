import {
  CloseButton,
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
import { useRouter } from "next/router"
import { Check, CheckCircle } from "phosphor-react"
import { useState } from "react"
import platformsContent from "../../platformsContent"
import InviteLink from "./components/InviteLink"
import useDCAuth from "./hooks/useDCAuth"
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
  // const {
  //   response: dcUserId,
  //   isLoading: isFetchingUserId,
  //   onSubmit: fetchUserId,
  //   error: dcUserIdError,
  // } = useSubmit(() =>
  //   fetcherWithDCAuth(authorization, "https://discord.com/api/users/@me").then(
  //     (res) => res.id
  //   )
  // )
  // useEffect(() => {
  //   if (authorization?.length > 0) fetchUserId()
  // }, [authorization])

  const [hideDCAuthNotification, setHideDCAuthNotification] = useState(
    !!authorization
  )

  const user = useUser()
  const discordFromDb = user?.platformUsers?.some(
    (platformUser) => platformUser.platformName === "DISCORD"
  )
  const discordFromQueryParam =
    router.query.platform === "DISCORD" && typeof router.query.hash === "string"

  const joinPlatformData: JoinPlatformData = discordFromDb
    ? undefined
    : discordFromQueryParam
    ? { hash: router.query.hash as string }
    : { authData: { access_token: authorization?.split(" ")?.[1] } }

  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
    signLoadingText,
  } = useJoinPlatform("DISCORD", joinPlatformData)

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
            error={error || joinError}
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
            {!discordFromDb &&
              !discordFromQueryParam &&
              (!!authorization ? (
                <Collapse in={!hideDCAuthNotification} unmountOnExit>
                  <ModalButton
                    mb="3"
                    as="div"
                    colorScheme="gray"
                    variant="solidStatic"
                    rightIcon={
                      <CloseButton onClick={() => setHideDCAuthNotification(true)} />
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
                  colorScheme="DISCORD"
                  isLoading={isAuthenticating}
                  loadingText={isAuthenticating && "Confirm in the pop-up"}
                >
                  Connect Discord
                </ModalButton>
              ))}

            {!response &&
              (() => {
                if (!discordFromDb && !discordFromQueryParam && !authorization)
                  return (
                    <ModalButton disabled colorScheme="gray">
                      Verify address
                    </ModalButton>
                  )
                if (isSigning)
                  return <ModalButton isLoading loadingText={signLoadingText} />
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
