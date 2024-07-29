import { usePostHogContext } from "@/components/Providers/PostHogProvider"
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
import SegmentedControl from "components/common/SegmentedControl"
import SearchBar from "components/explorer/SearchBar"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useController, useForm } from "react-hook-form"
import {
  CategoryValue,
  SolutionCardData,
  SolutionName,
  categories,
  engagement,
  memberships,
  nft,
  sybil,
  tokens,
} from "solutions"
import { PlatformName, PlatformType } from "types"
import Category from "./Category"

const categoryOptions = [{ label: "All", value: "all" }, ...categories]

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

  const categoryItems: Record<CategoryValue, SolutionCardData[]> = {
    engagement,
    memberships,
    sybil: sybil.filter(
      (solution) => showPolygonId || solution.handlerParam !== "POLYGON_ID"
    ),
    nft,
    tokens,
  }

  const { colorMode } = useColorMode()

  return (
    <ModalContent>
      <ModalCloseButton zIndex={2} />
      <ModalHeader
        fontFamily={"inherit"}
        fontSize={"inherit"}
        pr={{ base: 8, sm: 12 }}
        pb={{ base: 0, md: 3.5 }}
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
          mb={{ base: 5, md: 8 }}
          fontSize={{ base: "xl", md: "3xl" }}
          fontFamily="display"
          textAlign={{ md: "center" }}
          wordBreak={"break-word"}
        >
          Guild Solutions
        </Heading>

        <Stack
          direction={{ base: "column-reverse", md: "row" }}
          gap={3.5}
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Box
            overflowX={"auto"}
            w={{ base: "100vw", md: "full" }}
            pt="1px"
            mt="-1px"
            px={{ base: 7, sm: 11, md: 7 }}
            mx={{ md: "-7" }}
            pb={4}
            mb={{ md: -4 }}
            sx={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent)",
            }}
          >
            <SegmentedControl
              options={categoryOptions}
              {...categoryField}
              size="sm"
              isFullWidth={false}
              styleProps={{
                borderWidth: 0,
                bgColor: "none",
                padding: "0 !important",
                width: "max-content",
              }}
            />
          </Box>
          <SearchBar
            {...{ search, setSearch }}
            w={{ base: "full", md: "200px" }}
            flexShrink={0}
            size={{ base: "md", md: "sm" }}
          />
        </Stack>
      </ModalHeader>

      <ModalBody className="custom-scrollbar" pt={{ base: 6, md: 8 }}>
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
