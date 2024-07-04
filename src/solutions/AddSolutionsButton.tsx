import {
  Box,
  Collapse,
  HStack,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useBreakpointValue,
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
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ControlledSelect from "components/common/ControlledSelect"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import SegmentedControl from "components/common/SegmentedControl"
import SearchBar from "components/explorer/SearchBar"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FormProvider, useController, useForm, useWatch } from "react-hook-form"
import rewards, { modalSizeForPlatform } from "rewards"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { PlatformName, PlatformType } from "types"
import pluralize from "utils/pluralize"
import SolutionCard from "./SolutionCard"
import {
  SolutionCardData,
  engagement,
  memberships,
  sybil,
  tokens,
} from "./SolutionCardData"

export const solutions = {
  LIQUIDITY: dynamic(
    () => import("solutions/LiquidityIncentive/LiquidityIncentiveSetupModal"),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
}

export type Solutions = keyof typeof solutions

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

const AddSolutionsButton = () => {
  const { selection, step, isOpen, onOpen, setStep, onClose, setSelection } =
    useAddRewardContext()

  const { guildPlatforms } = useGuild()

  const [search, setSearch] = useState("")

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

  const isMobile = useBreakpointValue({ base: true, md: false })

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

  const categoryFormMethods = useForm({ mode: "all" })
  const {
    field: { ref, ...categoryField },
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
            <ModalHeader
              fontFamily={"inherit"}
              fontSize={"inherit"}
              pr={{ base: 8, sm: 12 }}
            >
              <Heading
                as="h1"
                mb={4}
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontFamily="display"
                textAlign={"center"}
                wordBreak={"break-word"}
              >
                Guild Solutions
              </Heading>

              <SearchBar {...{ search, setSearch }} mb={{ base: 2, md: 3 }} />
              <FormProvider {...categoryFormMethods}>
                {isMobile ? (
                  <ControlledSelect name="category" options={categories} />
                ) : (
                  <SegmentedControl
                    options={categories}
                    {...categoryField}
                    size="sm"
                  />
                )}
              </FormProvider>
            </ModalHeader>

            <ModalBody className="custom-scrollbar">
              <AnimatePresence>
                <Box>
                  <Collapse
                    in={
                      categoryField.value === "all" ||
                      categoryField.value === "memberships"
                    }
                  >
                    <Category
                      heading="Memberships"
                      items={memberships}
                      onSelectReward={onSelectReward}
                      onSelectSolution={onSelectSolution}
                      searchQuery={search}
                    />
                  </Collapse>

                  <Collapse
                    in={
                      categoryField.value === "all" ||
                      categoryField.value === "tokens"
                    }
                  >
                    <Category
                      heading="Tokens"
                      items={tokens}
                      onSelectReward={onSelectReward}
                      onSelectSolution={onSelectSolution}
                      searchQuery={search}
                    />
                  </Collapse>

                  <Collapse
                    in={
                      categoryField.value === "all" ||
                      categoryField.value === "engagement"
                    }
                  >
                    <Category
                      heading="Engagement"
                      items={engagement}
                      onSelectReward={onSelectReward}
                      onSelectSolution={onSelectSolution}
                      searchQuery={search}
                    />
                  </Collapse>

                  <Collapse
                    in={
                      categoryField.value === "all" ||
                      categoryField.value === "sybil"
                    }
                  >
                    <Category
                      heading="Sybil Protection"
                      items={sybil.filter(
                        (solution) =>
                          showPolygonId || solution.handlerParam !== "POLYGON_ID"
                      )}
                      onSelectReward={onSelectReward}
                      onSelectSolution={onSelectSolution}
                      searchQuery={search}
                    />
                  </Collapse>
                </Box>
              </AnimatePresence>
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

const Category = ({
  heading,
  items,
  onSelectReward,
  onSelectSolution,
  searchQuery,
}: {
  heading: string
  items: SolutionCardData[]
  onSelectReward: (reward: PlatformName) => void
  onSelectSolution: (solution: Solutions) => void
  searchQuery?: string
}) => {
  const filteredItems = items.filter((item) =>
    !!searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
      : item
  )

  return (
    <>
      <section>
        <HStack mb={3}>
          <Heading
            as="h2"
            color={"GrayText"}
            fontSize={"xs"}
            fontWeight={"bold"}
            textTransform={"uppercase"}
          >
            {heading}
          </Heading>
          {!!searchQuery && (
            <Text colorScheme="gray" fontWeight={"normal"} fontSize={"xs"}>
              ({pluralize(filteredItems.length, "result", true)})
            </Text>
          )}
        </HStack>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={{ base: 2, md: 3 }}
          mb={filteredItems.length === 0 ? 2 : 8}
        >
          {filteredItems.map((item, index) => (
            <CardMotionWrapper key={item.title}>
              <SolutionCard
                {...item}
                onClick={
                  item.handlerType === "reward"
                    ? () => onSelectReward(item.handlerParam as PlatformName)
                    : () => onSelectSolution(item.handlerParam as Solutions)
                }
              />
            </CardMotionWrapper>
          ))}
        </SimpleGrid>
      </section>
    </>
  )
}

export default AddSolutionsButtonWrapper
