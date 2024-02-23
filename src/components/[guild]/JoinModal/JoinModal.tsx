import {
  Center,
  Collapse,
  Divider,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  StackProps,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useShowErrorToast from "hooks/useShowErrorToast"
import dynamic from "next/dynamic"
import { ArrowRight, LockSimple } from "phosphor-react"
import platforms from "platforms/platforms"
import { ComponentType } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName, RequirementType } from "types"
import ConnectPlatform from "./components/ConnectPlatform"
import ShareSocialsCheckbox from "./components/ShareSocialsCheckbox"
import WalletAuthButton from "./components/WalletAuthButton"
import GetRewardsJoinStep from "./components/progress/GetRewardsJoinStep"
import GetRolesJoinStep from "./components/progress/GetRolesJoinStep"
import SatisfyRequirementsJoinStep from "./components/progress/SatisfyRequirementsJoinStep"
import useJoin from "./hooks/useJoin"
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

    if (
      !platforms[platform] ||
      platform === "POINTS" ||
      platform === "FORM" ||
      platform === "POLYGON_ID"
    )
      return null

    return <ConnectPlatform key={platform} platform={platform as PlatformName} />
  })

  const errorToast = useShowErrorToast()

  const {
    isLoading,
    onSubmit,
    error: joinError,
    joinProgress,
    reset,
  } = useJoin(
    (res) => {
      methods.setValue("platforms", {})
      onClose()
    },
    (err) => {
      errorToast(err)
      reset()
    }
  )

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Join {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={joinError} processError={processJoinPlatformError} />

            <Collapse in={!isInDetailedProgressState}>
              <VStack {...JOIN_STEP_VSTACK_PROPS}>
                <WalletAuthButton />
                {renderedSteps}
              </VStack>
            </Collapse>

            {!isInDetailedProgressState && <Divider mb={3} />}

            <SatisfyRequirementsJoinStep
              joinState={joinProgress}
              mb={isInDetailedProgressState ? "2.5" : "8"}
              spacing={isLoading || hasNoAccess ? "2.5" : "2"}
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
              RightComponent={
                !isLoading && !hasNoAccess ? (
                  <Tooltip
                    hasArrow
                    label="Connect your accounts and check access below to see if you meet the requirements the guild owner has set"
                  >
                    <Center w={5} h={6}>
                      <Icon as={LockSimple} weight="bold" />
                    </Center>
                  </Tooltip>
                ) : null
              }
            />

            {isInDetailedProgressState && <Divider my={2.5} />}

            <Collapse in={isInDetailedProgressState}>
              <VStack {...JOIN_STEP_VSTACK_PROPS} spacing={2.5} mb={6}>
                <GetRolesJoinStep joinState={joinProgress} />

                <GetRewardsJoinStep joinState={joinProgress} />
              </VStack>
            </Collapse>

            <Collapse in={!isLoading}>
              {featureFlags.includes("CRM") && <ShareSocialsCheckbox />}
            </Collapse>

            <ModalButton
              mt="2"
              onClick={handleSubmit(onJoin)}
              colorScheme="green"
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
