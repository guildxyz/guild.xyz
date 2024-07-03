import {
  Collapse,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Plus } from "@phosphor-icons/react"
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
import { Modal } from "components/common/Modal"
import SegmentedControl from "components/common/SegmentedControl"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FormProvider, useController, useForm, useWatch } from "react-hook-form"
import rewards, { modalSizeForPlatform } from "rewards"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { PlatformName, PlatformType } from "types"
import SolutionCard from "./SolutionCard"

const solutions = {
  LIQUIDITY: dynamic(
    () => import("solutions/LiquidityIncentive/LiquidityIncentiveSetupModal"),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
}

type Solutions = keyof typeof solutions

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

  const onSelectSolution = (solution: Solutions) => {
    const AddSolutionPanel = solutions[solution]
    setAddPanel(
      <AddSolutionPanel
        onClose={(closeAll) => {
          if (closeAll) handleClose()
          setStep("HOME")
        }}
      />
    )
    setStep("SOLUTION_SETUP")
  }

  const showPolygonId = !guildPlatforms?.some(
    (gp) => gp.platformId === PlatformType.POLYGON_ID
  )

  const categories = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Memberships",
      value: "memberships",
    },
    {
      label: "Tokens",
      value: "tokens",
    },
    {
      label: "Engagement",
      value: "engagement",
    },
    {
      label: "Sybil Protection",
      value: "sybil",
    },
  ]

  const categoryFormMethods = useForm({ mode: "all" })
  const {
    field: { ref: _ref, ...categoryField },
  } = useController({
    control: categoryFormMethods.control,
    name: "category",
    defaultValue: "all",
  })

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
              <FormProvider {...categoryFormMethods}>
                <SegmentedControl options={categories} {...categoryField} />
              </FormProvider>
              <Stack mt={8} spacing={0}>
                <Collapse
                  in={
                    categoryField.value === "all" ||
                    categoryField.value === "memberships"
                  }
                >
                  <section>
                    <Heading
                      textColor={"GrayText"}
                      fontSize={"large"}
                      fontWeight={"medium"}
                      mb={3}
                    >
                      Memberships
                    </Heading>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 4, md: 5 }}
                      mb={8}
                    >
                      <SolutionCard
                        title="Discord membership"
                        description="Exclusive Discord roles for accessing your server and channels."
                        imageUrl="/platforms/discord.png"
                        bgImageUrl="/solutions/discord-bg.jpg"
                        onClick={() => onSelectReward("DISCORD")}
                      />
                      <SolutionCard
                        title="Telegram group gating"
                        description="Start your exclusive token-gated Telegram group."
                        imageUrl="/platforms/telegram.png"
                        bgImageUrl="/solutions/telegram-bg.jpg"
                        onClick={() => onSelectReward("TELEGRAM")}
                      />
                      <SolutionCard
                        title="Gather Town gating"
                        description="Gather brings the best of in-person collaboration to distributed teams."
                        imageUrl="/platforms/gather.png"
                        bgImageUrl="/solutions/gather-bg.jpg"
                        onClick={() => onSelectReward("GATHER_TOWN")}
                      />
                      <SolutionCard
                        title="Google Docs gating"
                        description="Provide exclusive access to Google files for users who meet specific requirements."
                        imageUrl="/platforms/google.png"
                        bgImageUrl="/solutions/google-bg.jpg"
                        onClick={() => onSelectReward("GOOGLE")}
                      />
                      <SolutionCard
                        title="GitHub repository gating"
                        description="Grant access to a private codebase for qualifying contributors."
                        imageUrl="/platforms/github.png"
                        bgImageUrl="/solutions/github-bg.jpg"
                        onClick={() => onSelectReward("GITHUB")}
                      />
                    </SimpleGrid>
                  </section>
                </Collapse>

                <Collapse
                  in={
                    categoryField.value === "all" || categoryField.value === "tokens"
                  }
                >
                  <section>
                    <Heading
                      textColor={"GrayText"}
                      fontSize={"large"}
                      fontWeight={"medium"}
                      mb={3}
                    >
                      Tokens
                    </Heading>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 4, md: 5 }}
                      mb={8}
                    >
                      <SolutionCard
                        title="NFT Drop"
                        description="Launch NFT sales or open editions with specific collection requirements."
                        imageUrl="/platforms/nft.png"
                        bgImageUrl="/solutions/nft-bg.jpg"
                        onClick={() => onSelectReward("CONTRACT_CALL")}
                      />
                      <SolutionCard
                        title="Token liquidity program"
                        description="Reward users with points for providing liquidity to your token."
                        imageUrl="/solutions/liquidity.png"
                        bgImageUrl="/solutions/liquidity-bg.jpg"
                        onClick={() => onSelectSolution("LIQUIDITY")}
                      />
                    </SimpleGrid>
                  </section>
                </Collapse>

                <Collapse
                  in={
                    categoryField.value === "all" ||
                    categoryField.value === "engagement"
                  }
                >
                  <section>
                    <Heading
                      textColor={"GrayText"}
                      fontSize={"large"}
                      fontWeight={"medium"}
                      mb={3}
                    >
                      Engagement
                    </Heading>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 4, md: 5 }}
                      mb={8}
                    >
                      <SolutionCard
                        title="POAP Distribution"
                        description="Reward your attendees with POAPs (link)"
                        imageUrl="/platforms/poap.png"
                        bgImageUrl="/solutions/poap-bg.jpg"
                        onClick={() => onSelectReward("POAP")}
                      />
                      <SolutionCard
                        title="Points and Leaderboard"
                        description="Launch XP, Stars, Keys, Gems, or any other rewards you need.."
                        imageUrl="/platforms/points.png"
                        bgImageUrl="/solutions/points-bg.jpg"
                        onClick={() => onSelectReward("POINTS")}
                      />
                      <SolutionCard
                        title="Forms & Surveys"
                        description="Collect verified information, feedback, and applications, and reward your community."
                        imageUrl="/platforms/form.png"
                        bgImageUrl="/solutions/form-bg.jpg"
                        onClick={() => onSelectReward("FORM")}
                      />
                      <SolutionCard
                        title="Text or link distribution"
                        description="Distribute secret messages or promotion codes."
                        imageUrl="/platforms/text.png"
                        bgImageUrl="/solutions/text-bg.jpg"
                        onClick={() => onSelectReward("TEXT")}
                      />
                    </SimpleGrid>
                  </section>
                </Collapse>

                <Collapse
                  in={
                    categoryField.value === "all" || categoryField.value === "sybil"
                  }
                >
                  <section>
                    <Heading
                      textColor={"GrayText"}
                      fontSize={"large"}
                      fontWeight={"medium"}
                      mb={3}
                    >
                      Sybil protection
                    </Heading>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      gap={{ base: 4, md: 5 }}
                      mb={8}
                    >
                      {/* TODO: Disable if !showPolygonId */}
                      <SolutionCard
                        title="PolygonID credentials"
                        description="Self-Sovereign Identity Solution with Zero-Knowledge Proofs."
                        imageUrl="/requirementLogos/polygonId.svg"
                        bgImageUrl="/solutions/polygon-bg.jpg"
                        onClick={() => onSelectReward("POLYGON_ID")}
                      />
                    </SimpleGrid>
                  </section>
                </Collapse>
              </Stack>
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

export default AddSolutionsButtonWrapper
