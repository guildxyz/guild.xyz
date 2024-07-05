import {
  Box,
  Collapse,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Stack,
  useBreakpointValue,
  useColorMode,
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
  setSolution,
}: {
  setSolution: (name: SolutionName) => void
}) => {
  const { setStep, setSelection } = useAddRewardContext()
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

  const { colorMode } = useColorMode()

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader
        fontFamily={"inherit"}
        fontSize={"inherit"}
        pr={{ base: 8, sm: 12 }}
        pb={{ base: 7, md: 3.5 }}
        {...(colorMode === "light"
          ? { borderBottomWidth: "1px" }
          : {
              boxShadow:
                "2px 3px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              zIndex: "1",
            })}
      >
        <Heading
          as="h1"
          mb={{ base: 6, md: 8 }}
          fontSize={{ base: "xl", md: "3xl" }}
          fontFamily="display"
          textAlign={{ md: "center" }}
          wordBreak={"break-word"}
        >
          Guild Solutions
        </Heading>

        <Stack direction={{ base: "column", md: "row" }} alignItems="center">
          <FormProvider {...categoryFormMethods}>
            {isMobile ? (
              <ControlledSelect name="category" options={categoryOptions} />
            ) : (
              <SegmentedControl
                options={categoryOptions}
                {...categoryField}
                size="sm"
                isFullWidth={false}
                styleProps={{
                  borderWidth: 0,
                  bgColor: "none",
                  padding: "0 !important",
                }}
              />
            )}
          </FormProvider>
          <SearchBar
            {...{ search, setSearch }}
            w={{ base: "full", md: "sm" }}
            size={{ base: "md", md: "sm" }}
          />
        </Stack>
      </ModalHeader>

      <ModalBody className="custom-scrollbar" pt="8">
        <AnimatePresence>
          <Box>
            {categories.map((category) => (
              <Collapse
                key={category.value}
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
