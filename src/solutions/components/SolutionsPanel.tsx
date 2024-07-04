import {
  Box,
  Collapse,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import ControlledSelect from "components/common/ControlledSelect"
import SegmentedControl from "components/common/SegmentedControl"
import SearchBar from "components/explorer/SearchBar"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { FormProvider, useController, useForm } from "react-hook-form"
import {
  CategoryValue,
  SolutionCardData,
  SolutionName,
  categories,
  engagement,
  memberships,
  sybil,
  tokens,
} from "solutions"
import { PlatformName, PlatformType } from "types"
import Category from "./Category"

const SolutionsPanel = ({
  addReward,
  setSolution,
}: {
  addReward: (rp: any) => void
  setSolution: (name: SolutionName) => void
}) => {
  const { setStep, setSelection, onClose } = useAddRewardContext()
  const { guildPlatforms } = useGuild()

  const [search, setSearch] = useState("")

  const categoryFormMethods = useForm({ mode: "all" })
  const {
    field: { ref, ...categoryField },
  } = useController({
    control: categoryFormMethods.control,
    name: "category",
    defaultValue: "all",
  })

  const { startSessionRecording } = usePostHogContext()

  const isMobile = useBreakpointValue({ base: true, md: false })

  const onSelectReward = (platform: PlatformName) => {
    if (platform === "CONTRACT_CALL") startSessionRecording()
    setSelection(platform)
    setStep("REWARD_SETUP")
  }

  const onSelectSolution = (solution: SolutionName) => {
    setSolution(solution)
    setStep("SOLUTION_SETUP")
  }

  const showPolygonId = !guildPlatforms?.some(
    (gp) => gp.platformId === PlatformType.POLYGON_ID
  )

  const categoryOptions = [{ label: "All", value: "all" }, ...categories]

  const categoryItems: Record<CategoryValue, SolutionCardData[]> = {
    engagement: engagement,
    memberships: memberships,
    sybil: sybil.filter(
      (solution) => showPolygonId || solution.handlerParam !== "POLYGON_ID"
    ),
    tokens: tokens,
  }

  return (
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
            <ControlledSelect name="category" options={categoryOptions} />
          ) : (
            <SegmentedControl
              options={categoryOptions}
              {...categoryField}
              size="sm"
            />
          )}
        </FormProvider>
      </ModalHeader>

      <ModalBody className="custom-scrollbar">
        <AnimatePresence>
          <Box>
            {categories.map((category) => (
              <Collapse
                in={
                  categoryField.value === "all" ||
                  categoryField.value === category.value
                }
              >
                <Category
                  heading={category.label}
                  items={categoryItems[category.value]}
                  onSelectReward={onSelectReward}
                  onSelectSolution={onSelectSolution}
                  searchQuery={search}
                />
              </Collapse>
            ))}
          </Box>
        </AnimatePresence>
      </ModalBody>
    </ModalContent>
  )
}

export default SolutionsPanel
