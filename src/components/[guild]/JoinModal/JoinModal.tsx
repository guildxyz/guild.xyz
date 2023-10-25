import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import platforms from "platforms/platforms"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName, RequirementType } from "types"
import { useAccount } from "wagmi"
import CompleteCaptchaJoinStep from "./components/CompleteCaptchaJoinStep"
import ConnectPlatform from "./components/ConnectPlatform"
import ConnectPolygonIDJoinStep from "./components/ConnectPolygonIDJoinStep"
import SatisfyRequirementsJoinStep from "./components/SatisfyRequirementsJoinStep"
import ShareSocialsCheckbox from "./components/ShareSocialsCheckbox"
import TwitterRequirementsVerificationIssuesAlert from "./components/TwitterRequirementsVerificationIssuesAlert"
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
  const { isConnected } = useAccount()
  const { urlName, name, requiredPlatforms, featureFlags } = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
      ...(featureFlags.includes("CRM") ? { shareSocials: true } : {}),
    },
  })
  const { handleSubmit } = methods

  const renderedSteps = (requiredPlatforms ?? []).map((platform) => {
    if (!platforms[platform]) return null

    if (platform in customJoinStep) {
      const ConnectComponent = customJoinStep[platform]
      return <ConnectComponent key={platform} />
    }

    return <ConnectPlatform key={platform} platform={platform as PlatformName} />
  })

  const {
    progress,
    isLoading,
    onSubmit,
    error: joinError,
    response,
  } = useJoin((res) => {
    methods.setValue("platforms", {})
    if (res.success) onClose()
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Join {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* temporary for zkSync launch */}
            {urlName === "zksync-era" &&
              (isLoading ? (
                <Alert status="info" mb="8">
                  <AlertIcon />
                  <Stack>
                    <AlertTitle>Joining in progress</AlertTitle>
                    <AlertDescription>
                      Feel free to close the site & check back later. If you're
                      eligible, you'll already be a member hopefully!
                      {(() => {
                        const estTimestamp = progress?.[
                          "children:manage-reward:jobs"
                        ]?.find(
                          (job) => job.flowName === "manage-reward:discord"
                        )?.delayReadyTimestamp
                        const estDate = new Date(estTimestamp)

                        if (estTimestamp)
                          return (
                            <Text fontWeight={"bold"}>
                              Estimated join time: {estDate.toLocaleTimeString()}
                            </Text>
                          )
                      })()}
                    </AlertDescription>
                  </Stack>
                </Alert>
              ) : (
                <Alert status="info" mb="8">
                  <AlertIcon />
                  <AlertDescription>
                    This guild is experiencing huge traffic right now. Joining
                    & getting your role may take up to half an hour
                  </AlertDescription>
                </Alert>
              ))}
            <Error error={joinError} processError={processJoinPlatformError} />
            <VStack
              spacing="3"
              alignItems="stretch"
              w="full"
              divider={<Divider />}
              mb="8"
            >
              <WalletAuthButton />
              {renderedSteps}
              <SatisfyRequirementsJoinStep
                isLoading={isLoading}
                hasNoAccessResponse={response?.success === false}
                onClose={onClose}
              />
            </VStack>

            {featureFlags.includes("CRM") && <ShareSocialsCheckbox />}

            <TwitterRequirementsVerificationIssuesAlert />

            <ModalButton
              mt="2"
              onClick={handleSubmit(onSubmit)}
              colorScheme="green"
              isLoading={isLoading}
              loadingText={"Checking access"}
              isDisabled={!isConnected}
            >
              Check access to join
            </ModalButton>
          </ModalBody>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default JoinModal
