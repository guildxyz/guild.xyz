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
import useGuild from "components/[guild]/hooks/useGuild"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName, RequirementType } from "types"
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

const customJoinStep: Partial<Record<Joinable, () => JSX.Element>> = {
  POLYGON: ConnectPolygonIDJoinStep,
  CAPTCHA: CompleteCaptchaJoinStep,
}

const JoinModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { isActive } = useWeb3React()
  const { name, requiredPlatforms } = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
    },
  })
  const { handleSubmit } = methods

  const renderedSteps = (requiredPlatforms ?? []).map((platform) => {
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
              loadingText={signLoadingText || "Checking access"}
              isDisabled={!isActive}
            >
              Check access to join
            </ModalButton>
          </ModalBody>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default JoinModal
