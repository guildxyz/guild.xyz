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
import { PlatformName, PlatformType } from "types"
import DiscordAuthButton from "./components/DiscordAuthButton"
import GithubAuthButton from "./components/GithubAuthButton"
import GoogleAuthButton from "./components/GoogleAuthButton"
import TelegramAuthButton from "./components/TelegramAuthButton"
import TwitterAuthButton from "./components/TwitterAuthButton"
import WalletAuthButton from "./components/WalletAuthButton"
import useJoin from "./hooks/useJoin"
import processJoinPlatformError from "./utils/processJoinPlatformError"

const PlatformAuthButtons: Record<Exclude<PlatformName, "">, () => JSX.Element> = {
  DISCORD: DiscordAuthButton,
  TELEGRAM: TelegramAuthButton,
  TWITTER: TwitterAuthButton,
  GITHUB: GithubAuthButton,
  GOOGLE: GoogleAuthButton,
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { name, guildPlatforms, roles } = useGuild()
  const { platformUsers } = useUser()

  const hasTwitterRewuirement = !!roles?.some((role) =>
    role.requirements?.some((requirement) =>
      requirement?.type?.startsWith("TWITTER")
    )
  )

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
    ...(hasTwitterRewuirement ? ["TWITTER"] : []),
  ]

  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
    signLoadingText,
  } = useJoin()

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
                <Text mb="8">Connect your account(s) to join.</Text>
                <VStack spacing="3" alignItems="strech" w="full">
                  <WalletAuthButton />
                  {allGuildPlatforms.map((platform) => {
                    const PlatformAuthButton = PlatformAuthButtons[platform]
                    return <PlatformAuthButton key={platform} />
                  })}
                  {allGuildPlatforms.length && <Divider />}
                  {(() => {
                    if (isSigning || isLoading)
                      return (
                        <ModalButton
                          isLoading
                          loadingText={signLoadingText}
                          colorScheme="green"
                        />
                      )
                    if (!response)
                      return (
                        <ModalButton
                          onClick={handleSubmit(onSubmit)}
                          colorScheme="green"
                          isDisabled={
                            // only enable if authed with all platforms, won't need later
                            !allGuildPlatforms.every(
                              (platform) =>
                                platformUsers?.some(
                                  (platformUser) =>
                                    platformUser.platformName === platform
                                ) || newConnectedPlatforms[platform]
                            )
                          }
                        >
                          Join guild
                        </ModalButton>
                      )
                  })()}
                </VStack>
              </>
            ) : (
              <Stack spacing="6" divider={<Divider />}>
                {response?.success ? (
                  <HStack spacing={6}>
                    <Icon
                      as={CheckCircle}
                      color="green.500"
                      boxSize="16"
                      weight="light"
                    />
                    <Text ml="6">
                      Successfully joined guild, your accesses should appear soon!
                    </Text>
                  </HStack>
                ) : (
                  <Text>Couldn't join guild</Text>
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
