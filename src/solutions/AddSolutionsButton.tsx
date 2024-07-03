import {
  Circle,
  HStack,
  Heading,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { IconProps, Plus } from "@phosphor-icons/react"
import {
  AddRewardForm,
  defaultValues,
} from "components/[guild]/AddRewardButton/AddRewardButton"
import SelectRolePanel from "components/[guild]/AddRewardButton/SelectRolePanel"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { ClientStateRequirementHandlerProvider } from "components/[guild]/RequirementHandlerContext"
import { useIsTabsStuck } from "components/[guild]/Tabs"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DisplayCard from "components/common/DisplayCard"
import { Modal } from "components/common/Modal"
import PlatformSelectButton from "components/create-guild/PlatformsGrid/components/PlatformSelectButton"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ComponentType, RefAttributes, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import rewards, { modalSizeForPlatform } from "rewards"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { PlatformName, PlatformType } from "types"
import SolutionSelectButton from "./SolutionSelectButton"

const solutions = {
  LIQUIDITY: dynamic(
    () => import("solutions/LiquidityIncentive/LiquidityIncentiveSetupModal"),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
}

const AddSolutionsButton = () => {
  const { selection, step, isOpen, onOpen, setStep, onClose, setSelection } =
    useAddRewardContext()

  const { guildPlatforms, featureFlags } = useGuild()

  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const isRewardSetupStep = selection && step === "REWARD_SETUP"

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const handleAddReward = (createdRolePlatform: any) => {
    const { roleName = null, requirements = null, ...rest } = createdRolePlatform
    methods.setValue("rolePlatforms.0", {
      ...rest,
      visibility,
    })
    if (roleName) methods.setValue("roleName", roleName)
    if (Array.isArray(requirements) && requirements.length > 0) {
      methods.setValue("requirements", requirements)
    }
    setStep("SELECT_ROLE")
  }

  const handleClose = () => {
    if (isAddRewardPanelDirty) {
      onDiscardAlertOpen()
    } else {
      onClose()
    }
  }

  const handleDiscard = () => {
    onClose()
    onDiscardAlertClose()
    setIsAddRewardPanelDirty(false)
  }

  const { isStuck } = useIsTabsStuck()
  const { textColor = null, buttonColorScheme = null } = useThemeContext() || {}

  const { startSessionRecording } = usePostHogContext()

  const [AddPanel, setAddPanel] = useState<JSX.Element>()

  const onSelectReward = (platform: PlatformName) => {
    if (platform === "CONTRACT_CALL") startSessionRecording()
    const { AddRewardPanel } = rewards[platform] ?? {}
    setAddPanel(<AddRewardPanel onAdd={handleAddReward} skipSettings />)
    setSelection(platform)
    setStep("REWARD_SETUP")
  }

  const getPlatformSelectButton = ({
    title,
    description,
    platform,
  }: {
    title: string
    description?: string
    platform: PlatformName
  }) => (
    <PlatformSelectButton
      platform={platform}
      title={title}
      description={description}
      icon={rewards[platform].icon}
      imageUrl={rewards[platform].imageUrl}
      onSelection={onSelectReward}
    />
  )

  const showPolygonId = !guildPlatforms?.some(
    (gp) => gp.platformId === PlatformType.POLYGON_ID
  )

  return (
    <>
      <Button
        data-test="add-reward-button"
        leftIcon={<Plus />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      >
        Add solution
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={
          step === "SELECT_ROLE"
            ? "2xl"
            : step === "SOLUTION_SETUP"
            ? "xl"
            : isRewardSetupStep
            ? modalSizeForPlatform(selection)
            : "4xl"
        }
        scrollBehavior="inside"
        colorScheme="dark"
      >
        <ModalOverlay />

        {step === "HOME" && (
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Text>Add solution</Text>
            </ModalHeader>

            <ModalBody className="custom-scrollbar">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
                <SolutionCard
                  title="Token liquidity program"
                  description="Reward users with points for providing liquidity to your token."
                  imageUrl="/solutions/liquidity.png"
                  bgImageUrl="/solutions/nft-background.png"
                />

                {getPlatformSelectButton({
                  title: "Points and leaderboard",
                  description: "Launch XP, Stars, Keys, Gems, or whatever you need",
                  platform: "POINTS",
                })}

                {getPlatformSelectButton({
                  title: "NFT drop",
                  description: "Sales, open editions, and gating",
                  platform: "CONTRACT_CALL",
                })}

                <SolutionSelectButton
                  title="Token liquidity program"
                  description="Points reward for liquidity providers"
                  imageUrl="/solutions/liquidity.png"
                  onSelection={() => {
                    const AddSolutionPanel = solutions.LIQUIDITY
                    setAddPanel(
                      <AddSolutionPanel
                        onClose={(closeAll) => {
                          if (closeAll) handleClose()
                          setStep("HOME")
                        }}
                      />
                    )
                    setStep("SOLUTION_SETUP")
                  }}
                />

                {getPlatformSelectButton({
                  title: "Web3 form",
                  description: "Quizzes, surveys, or simple questions",
                  platform: "FORM",
                })}

                {getPlatformSelectButton({
                  title: "Discord role gating",
                  platform: "DISCORD",
                })}

                {getPlatformSelectButton({
                  title: "Telegram group gating",
                  platform: "TELEGRAM",
                })}

                {getPlatformSelectButton({
                  title: "POAP distribution",
                  platform: "POAP",
                })}

                {getPlatformSelectButton({
                  title: "Text or link distribution",
                  platform: "TEXT",
                })}

                {showPolygonId &&
                  getPlatformSelectButton({
                    title: "PolygonID credentials",
                    platform: "POLYGON_ID",
                  })}

                {getPlatformSelectButton({
                  title: "Gather Town gating",
                  platform: "GATHER_TOWN",
                })}

                {getPlatformSelectButton({
                  title: "Google Docs gating",
                  platform: "GOOGLE",
                })}

                {getPlatformSelectButton({
                  title: "GitHub repository gating",
                  platform: "GITHUB",
                })}
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        )}

        <FormProvider {...methods}>
          <ClientStateRequirementHandlerProvider methods={methods}>
            {isRewardSetupStep && !!AddPanel && AddPanel}
            {step === "SELECT_ROLE" && <SelectRolePanel onSuccess={onClose} />}
          </ClientStateRequirementHandlerProvider>
        </FormProvider>

        {step === "SOLUTION_SETUP" && !!AddPanel && AddPanel}

        <DiscardAlert
          isOpen={isDiscardAlertOpen}
          onClose={onDiscardAlertClose}
          onDiscard={handleDiscard}
        />
      </Modal>
    </>
  )
}

const AddSolutionsButtonWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddSolutionsButton />
  </AddRewardProvider>
)

const SolutionCard = ({
  title,
  description,
  imageUrl,
  bgImageUrl,
  icon,
}: {
  title: string
  description?: string
  imageUrl?: string
  bgImageUrl?: string
  icon?: ComponentType<IconProps & RefAttributes<SVGSVGElement>>
}) => {
  const circleBgColor = useColorModeValue("gray.100", "gray.600")
  const iconColor = useColorModeValue("black", "white")

  return (
    <>
      <DisplayCard
        boxShadow={"none"}
        px={4}
        py={4}
        position="relative"
        outline="1px solid white"
        outlineColor="whiteAlpha.300"
        outlineOffset="-1px"
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          left: 0,
          bg: `url('${bgImageUrl}')`,
          bgRepeat: "no-repeat",
          bgPosition: "center",
          bgSize: "cover",
          width: "100%",
          height: "100%",
          opacity: 0.3,
          transition: "0.3s",
          filter: `blur(3px) saturate(50%)`,
        }}
        _hover={{
          _before: { opacity: 0.5, filter: `blur(3px) saturate(80%)` },
        }}
      >
        <Stack spacing={3} zIndex={1}>
          <HStack>
            {imageUrl ? (
              <Circle
                size="12"
                pos="relative"
                overflow="hidden"
                bgColor={circleBgColor}
              >
                <Image src={imageUrl} alt="Guild logo" fill sizes="3rem" />
              </Circle>
            ) : (
              <Circle
                bgColor={circleBgColor}
                size="12"
                pos="relative"
                overflow="hidden"
              >
                <Icon as={icon} boxSize={5} weight="regular" color={iconColor} />
              </Circle>
            )}

            <Heading
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
            >
              {title}
            </Heading>
          </HStack>
          {description && (
            <Text colorScheme="gray" lineHeight={1.33}>
              {description}
            </Text>
          )}
        </Stack>
      </DisplayCard>
    </>
  )
}

export default AddSolutionsButtonWrapper
