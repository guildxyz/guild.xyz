import {
  Box,
  Collapse,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useShowErrorToast from "hooks/useShowErrorToast"
import dynamic from "next/dynamic"
import { ArrowRight } from "phosphor-react"
import rewards from "platforms/rewards"
import { ComponentType, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName, RequirementType } from "types"
import ConnectPlatform from "./components/ConnectPlatform"
import ShareSocialsCheckbox from "./components/ShareSocialsCheckbox"
import WalletAuthButton from "./components/WalletAuthButton"
import GetRewardsJoinStep from "./components/progress/GetRewardsJoinStep"
import GetRolesJoinStep from "./components/progress/GetRolesJoinStep"
import SatisfyRequirementsJoinStep from "./components/progress/SatisfyRequirementsJoinStep"
import useJoin from "./hooks/useJoin"

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
  EMAIL: dynamic(() => import("./components/ConnectEmailJoinStep")),
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
    if (platform in customJoinStep) {
      const ConnectComponent = customJoinStep[platform]
      return <ConnectComponent key={platform} />
    }

    if (!rewards[platform]?.isPlatform) return null

    return <ConnectPlatform key={platform} platform={platform as PlatformName} />
  })

  const errorToast = useShowErrorToast()

  const { isLoading, onSubmit, joinProgress, reset } = useJoin({
    onSuccess: () => {
      methods.setValue("platforms", {})
      onClose()
    },
    onError: (err) => {
      errorToast(err)
      reset()
    },
  })

  const onJoin = (data) =>
    onSubmit({
      shareSocials: data?.shareSocials,
      platforms:
        data &&
        Object.entries(data.platforms ?? {})
          .filter(([_, value]) => !!value)
          .map(([key, value]: any) => ({
            name: key,
            ...value,
          })),
    })

  const isInDetailedProgressState =
    joinProgress?.state === "MANAGING_ROLES" ||
    joinProgress?.state === "MANAGING_REWARDS" ||
    joinProgress?.state === "FINISHED"

  const hasNoAccess = joinProgress?.state === "NO_ACCESS"

  const { roles } = useGuild()

  const onClick = () => {
    onClose()
    window.location.hash = `role-${roles[0]?.id}`
  }
  // so we don't focus the TopRecheckAccessesButton button after join
  const dummyFinalFocusRef = useRef(null)

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={dummyFinalFocusRef}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Join {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt="0">
            <Collapse in={!isInDetailedProgressState}>
              <VStack {...JOIN_STEP_VSTACK_PROPS}>
                <WalletAuthButton />
                {renderedSteps}
              </VStack>
            </Collapse>

            {/* wrapper box to apply the margin when the collapse is `display: none` too */}
            <Box mb={isInDetailedProgressState ? 2.5 : 8}>
              <Collapse in={isLoading || hasNoAccess}>
                {!isInDetailedProgressState && <Divider mb={3} />}
                <SatisfyRequirementsJoinStep
                  joinState={joinProgress}
                  spacing={2.5}
                  fallbackText={
                    hasNoAccess && (
                      <Text color="initial">
                        {`You're not eligible with your connected accounts. `}
                        <Button
                          variant="link"
                          rightIcon={<ArrowRight />}
                          onClick={onClick}
                          iconSpacing={1.5}
                        >
                          See requirements
                        </Button>
                      </Text>
                    )
                  }
                />
              </Collapse>
            </Box>

            {isInDetailedProgressState && <Divider my={2.5} />}

            <Collapse in={isInDetailedProgressState}>
              <VStack {...JOIN_STEP_VSTACK_PROPS} spacing={2.5} mb={6}>
                <GetRolesJoinStep joinState={joinProgress} />

                <GetRewardsJoinStep joinState={joinProgress} />
              </VStack>
            </Collapse>

            <Collapse in={!(isLoading || hasNoAccess)}>
              {featureFlags.includes("CRM") && <ShareSocialsCheckbox />}
            </Collapse>

            <ModalButton
              mt="2"
              onClick={handleSubmit(onJoin)}
              colorScheme={hasNoAccess ? "gray" : "green"}
              variant={hasNoAccess ? "outline" : "solid"}
              size={hasNoAccess ? "md" : "lg"}
              isLoading={isLoading}
              loadingText={
                joinProgress?.state === "FINISHED"
                  ? "Finalizing results"
                  : !!joinProgress
                  ? "See status above"
                  : "Checking access"
              }
              isDisabled={!isWeb3Connected}
            >
              {hasNoAccess ? "Recheck access" : "Check access to join"}
            </ModalButton>
          </ModalBody>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default JoinModal
