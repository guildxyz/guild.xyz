import {
  Divider,
  HStack,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { CheckCircle } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"
import DiscordAuthButton from "./components/DiscordAuthButton"
import InviteLink from "./components/InviteLink"
import TelegramAuthButton from "./components/TelegramAuthButton"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

const PlatformAuthButtons = {
  DISCORD: DiscordAuthButton,
  TELEGRAM: TelegramAuthButton,
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { name, guildPlatforms } = useGuild()
  const { platformUsers } = useUser()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
    },
  })
  const { handleSubmit, watch } = methods
  const newConnectedPlatforms = watch("platforms")

  const allGuildPlatforms = [
    ...new Set(guildPlatforms.map((platform) => PlatformType[platform.platformId])),
  ]

  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
    signLoadingText,
  } = useJoinPlatform()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Join {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={joinError} processError={processJoinPlatformError} />
            {!response ? (
              <>
                <Text mb="8">
                  Connect your account(s) and sign a message to join.
                </Text>
                <VStack spacing="3" alignItems="strech" w="full">
                  {allGuildPlatforms.map((platform) => {
                    const PlatformAuthButton = PlatformAuthButtons[platform]
                    return <PlatformAuthButton key={platform} />
                  })}
                  {allGuildPlatforms.length && <Divider />}
                  {(() => {
                    if (isSigning)
                      return (
                        <ModalButton
                          isLoading
                          loadingText={signLoadingText}
                          colorScheme="green"
                        />
                      )
                    if (isLoading)
                      return (
                        <ModalButton
                          isLoading
                          loadingText="Generating invite link"
                          colorScheme="green"
                        />
                      )
                    if (!response)
                      return (
                        <ModalButton
                          onClick={handleSubmit(onSubmit)}
                          colorScheme="green"
                          isDisabled={
                            !allGuildPlatforms.every(
                              (platform) =>
                                platformUsers?.some(
                                  (platformUser) =>
                                    platformUser.platformName === platform
                                ) || newConnectedPlatforms[platform]
                            )
                          }
                        >
                          Sign to join
                        </ModalButton>
                      )
                  })()}
                </VStack>
              </>
            ) : (
              <Stack divider={<Divider />}>
                {response?.platformResults?.map((platformResult) =>
                  platformResult.success === true ? (
                    <HStack spacing={6}>
                      <Icon
                        as={CheckCircle}
                        color="green.500"
                        boxSize="16"
                        weight="light"
                      />
                      <Text ml="6">
                        {/* only possible for Discord right now */}
                        Seems like you've already joined the Discord server, you
                        should get access to the correct channels soon!
                      </Text>
                    </HStack>
                  ) : (
                    <InviteLink inviteLink={platformResult?.invite} />
                  )
                )}
              </Stack>
            )}
          </ModalBody>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default JoinModal
