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
import { PlatformName, PlatformType, RequirementType } from "types"
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

type ExtractPrefix<T> = T extends `${infer Prefix}_${string}` ? Prefix : T
type Joinable = PlatformName | ExtractPrefix<RequirementType>

const joinableRequirementPlatforms = new Set<Joinable>([
  "TWITTER",
  "GITHUB",
  "CAPTCHA",
  "POLYGON",
])

const customJoinStep: Partial<Record<Joinable, () => JSX.Element>> = {
  POLYGON: ConnectPolygonIDJoinStep,
  CAPTCHA: CompleteCaptchaJoinStep,
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

  const allJoinables = new Set<Joinable>()

  guildPlatforms?.forEach((platform) =>
    allJoinables.add(PlatformType[platform.platformId] as Joinable)
  )

  roles?.forEach((role) =>
    role.requirements.forEach(({ type }) => {
      const joinable = type.split("_")[0] as Joinable
      if (joinableRequirementPlatforms.has(joinable)) {
        allJoinables.add(joinable)
      }
    })
  )

  const renderedSteps = [...allJoinables].map((platform) => {
    if (platform in customJoinStep) {
      const ConnectComponent = customJoinStep[platform]
      return <ConnectComponent key={platform} />
    }
    return <ConnectPlatform key={platform} platform={platform as PlatformName} />
  })

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
              loadingText={signLoadingText || "Joining Guild"}
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
