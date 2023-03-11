import {
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName, PlatformType } from "types"
import CompleteCaptchaJoinStep from "./components/CompleteCaptchaJoinStep"
import ConnectPlatform from "./components/ConnectPlatform"
import ConnectPolygonIDJoinStep from "./components/ConnectPolygonIDJoinStep"
import WalletAuthButton from "./components/WalletAuthButton"
import useJoin from "./hooks/useJoin"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { isActive } = useWeb3React()
  const { name, guildPlatforms, roles } = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
    },
  })
  const { handleSubmit } = methods

  const hasTwitterRequirement = !!roles?.some((role) =>
    role.requirements?.some((requirement) =>
      requirement?.type?.startsWith("TWITTER")
    )
  )
  const hasGithubRequirement = !!roles?.some((role) =>
    role.requirements?.some((requirement) => requirement?.type?.startsWith("GITHUB"))
  )
  const allPlatforms = guildPlatforms?.map(
    (platform) => PlatformType[platform.platformId]
  )
  if (hasTwitterRequirement) allPlatforms.push("TWITTER")
  if (hasGithubRequirement) allPlatforms.push("GITHUB")
  const allUniquePlatforms = [...new Set(allPlatforms)]

  const allRequirements = roles?.flatMap((role) => role.requirements)

  const hasCaptchaRequirement = !!allRequirements?.some(
    (req) => req.type === "CAPTCHA"
  )

  const hasPolygonIDRequirement = !!allRequirements?.some((req) =>
    req.type.startsWith("POLYGON")
  )

  const renderedSteps = [
    ...allUniquePlatforms.map((platform: PlatformName) => (
      <ConnectPlatform key={platform} {...{ platform }} />
    )),
    hasCaptchaRequirement && <CompleteCaptchaJoinStep />,
    hasPolygonIDRequirement && <ConnectPolygonIDJoinStep />,
  ].filter(Boolean)

  const {
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
    signLoadingText,
  } = useJoin(() => {
    methods.setValue("platforms", {})
    onClose()
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Join {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={joinError} processError={processJoinPlatformError} />
            <VStack spacing="3" alignItems="stretch" w="full" divider={<Divider />}>
              <WalletAuthButton />
              {renderedSteps}
            </VStack>
            <ModalButton
              mt="8"
              onClick={handleSubmit(onSubmit)}
              colorScheme="green"
              isLoading={isSigning || isLoading}
              loadingText={signLoadingText}
              isDisabled={!isActive}
            >
              Join guild
            </ModalButton>
          </ModalBody>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default JoinModal
