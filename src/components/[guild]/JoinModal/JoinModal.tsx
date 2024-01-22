import {
  Collapse,
  Divider,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import dynamic from "next/dynamic"
import platforms from "platforms/platforms"
import { ComponentType, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName, RequirementType } from "types"
import ConnectPlatform from "./components/ConnectPlatform"
import { JoinStepIndicator } from "./components/JoinStep"
import SatisfyRequirementsJoinStep, {
  JOIN_LOADING_TESTS,
} from "./components/SatisfyRequirementsJoinStep"
import ShareSocialsCheckbox from "./components/ShareSocialsCheckbox"
import TwitterRequirementsVerificationIssuesAlert from "./components/TwitterRequirementsVerificationIssuesAlert"
import WalletAuthButton from "./components/WalletAuthButton"
import useJoin, { JoinState } from "./hooks/useJoin"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

type ExtractPrefix<T> = T extends `${infer Prefix}_${string}` ? Prefix : T
type Joinable = PlatformName | ExtractPrefix<RequirementType>

const JOIN_STEP_VSTACK_PROPS: StackProps = {
  spacing: "3",
  alignItems: "stretch",
  w: "full",
  divider: <Divider />,
  mb: "3",
}

const customJoinStep: Partial<Record<Joinable, ComponentType<unknown>>> = {
  POLYGON: dynamic(() => import("./components/ConnectPolygonIDJoinStep")),
  CAPTCHA: dynamic(() => import("./components/CompleteCaptchaJoinStep")),
}

export const getRoleIndicatorProps = (
  joinState: JoinState
): Parameters<typeof JoinStepIndicator>[number] =>
  !joinState || joinState.state === "INITIAL"
    ? { status: "INACTIVE" }
    : {
        status: joinState.state === "MANAGING_ROLES" ? "LOADING" : "DONE",
      }

export const getRewardIndicatorProps = (
  joinState: JoinState
): Parameters<typeof JoinStepIndicator>[number] =>
  !joinState || joinState.state === "INITIAL"
    ? { status: "INACTIVE" }
    : joinState.state === "MANAGING_REWARDS" && joinState.rewards
    ? {
        status: "PROGRESS",
        progress: (joinState.rewards.granted / joinState.rewards.all) * 100,
      }
    : {
        status:
          joinState.state === "MANAGING_REWARDS"
            ? "LOADING"
            : joinState.state === "FINISHED"
            ? "DONE"
            : "INACTIVE",
      }

const JoinModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { name, requiredPlatforms, featureFlags } = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
      ...(featureFlags.includes("CRM") ? { shareSocials: true } : {}),
    },
  })
  const { handleSubmit } = methods

  const renderedSteps = (requiredPlatforms ?? []).map((platform) => {
    if (!platforms[platform] || platform === "POINTS") return null

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
    response,
    joinProgress,
  } = useJoin((res) => {
    methods.setValue("platforms", {})
    if (res.success) onClose()
  })

  useEffect(() => {
    console.log("PROGRESS", joinProgress)
  }, [joinProgress])

  const isManagingRolesOrRewards =
    joinProgress?.state === "MANAGING_ROLES" ||
    joinProgress?.state === "MANAGING_REWARDS"

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Join {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={joinError} processError={processJoinPlatformError} />

            <Collapse in={!isManagingRolesOrRewards} style={{ overflow: "visible" }}>
              <VStack {...JOIN_STEP_VSTACK_PROPS}>
                <WalletAuthButton />
                {renderedSteps}
              </VStack>
            </Collapse>

            {!isManagingRolesOrRewards && <Divider />}

            <SatisfyRequirementsJoinStep
              mt={"3"}
              mb={isManagingRolesOrRewards ? "3" : "8"}
              isLoading={isLoading}
              hasNoAccessResponse={response?.success === false}
              onClose={onClose}
              joinState={joinProgress}
            />

            {isManagingRolesOrRewards && <Divider my={3} />}

            <Collapse in={isManagingRolesOrRewards}>
              <VStack {...JOIN_STEP_VSTACK_PROPS}>
                <HStack py="3">
                  <JoinStepIndicator {...getRoleIndicatorProps(joinProgress)} />
                  <Stack w="full" spacing={0} mt="-1.5px !important">
                    <Text fontWeight={"bold"}>Get roles</Text>
                    {!!joinProgress?.roles && (
                      <Text>
                        {joinProgress.roles.granted}/{joinProgress.roles.all} roles
                        granted
                      </Text>
                    )}
                    {joinProgress?.state === "MANAGING_ROLES" &&
                      JOIN_LOADING_TESTS[joinProgress?.state]?.[
                        +!!joinProgress?.waitingPosition
                      ] && (
                        <Text>
                          {
                            JOIN_LOADING_TESTS[joinProgress?.state][
                              +!!joinProgress?.waitingPosition
                            ]
                          }
                        </Text>
                      )}
                  </Stack>
                </HStack>

                <HStack py="3">
                  <JoinStepIndicator {...getRewardIndicatorProps(joinProgress)} />
                  <Stack w="full" spacing={0} mt="-1.5px !important">
                    <Text fontWeight={"bold"}>Get rewards</Text>
                    {!!joinProgress?.rewards && (
                      <Text>
                        {joinProgress.rewards.granted}/{joinProgress.rewards.all}{" "}
                        roles granted
                      </Text>
                    )}
                    {!joinProgress?.rewards &&
                      joinProgress?.state === "MANAGING_REWARDS" &&
                      JOIN_LOADING_TESTS[joinProgress?.state]?.[
                        +!!joinProgress?.waitingPosition
                      ] && (
                        <Text>
                          {
                            JOIN_LOADING_TESTS[joinProgress?.state][
                              +!!joinProgress?.waitingPosition
                            ]
                          }
                        </Text>
                      )}
                  </Stack>
                </HStack>
              </VStack>
            </Collapse>

            <Collapse in={!isLoading}>
              {featureFlags.includes("CRM") && <ShareSocialsCheckbox />}
              <TwitterRequirementsVerificationIssuesAlert />
            </Collapse>

            <ModalButton
              mt="2"
              onClick={handleSubmit(onSubmit)}
              colorScheme="green"
              isLoading={isLoading}
              loadingText={"Checking access"}
              isDisabled={!isWeb3Connected}
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
