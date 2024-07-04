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
import rewards from "rewards"
import {
  SolutionName,
  categories,
  engagement,
  memberships,
  solutions,
  sybil,
  tokens,
} from "solutions"
import { PlatformName, PlatformType } from "types"
import Category from "./Category"

const SolutionsPanel = ({
  addReward,
  setAddPanel,
}: {
  addReward: (rp: any) => void
  setAddPanel: (panel: JSX.Element) => void
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
    const { AddRewardPanel } = rewards[platform] ?? {}
    setAddPanel(<AddRewardPanel onAdd={addReward} skipSettings />)
    setSelection(platform)
    setStep("REWARD_SETUP")
  }

  const onSelectSolution = (solution: SolutionName) => {
    const AddSolutionPanel = solutions[solution]
    setAddPanel(
      <AddSolutionPanel
        onClose={(closeAll) => {
          if (closeAll) onClose()
          setStep("HOME")
        }}
      />
    )
    setStep("SOLUTION_SETUP")
  }

  const showPolygonId = !guildPlatforms?.some(
    (gp) => gp.platformId === PlatformType.POLYGON_ID
  )

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
            <ControlledSelect name="category" options={categories} />
          ) : (
            <SegmentedControl options={categories} {...categoryField} size="sm" />
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
              in={categoryField.value === "all" || categoryField.value === "tokens"}
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
                categoryField.value === "all" || categoryField.value === "engagement"
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
              in={categoryField.value === "all" || categoryField.value === "sybil"}
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
  )
}

export default SolutionsPanel
