import { Box, Circle, Flex, HStack, Icon, SimpleGrid, Text } from "@chakra-ui/react"
import { Lightning } from "phosphor-react"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { RequirementProps } from "./Requirement"
import { useRequirementContext } from "./RequirementContext"
import { RequirementImage, RequirementImageCircle } from "./RequirementImage"

const DataProviderRequirement = ({
  image,
  isImageLoading,
  children,
  rightElement,
}: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const ProvidedValueDisplay = REQUIREMENT_PROVIDED_VALUES[requirement?.type]

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Box mt="3px" alignSelf={"start"} position={"relative"}>
        <RequirementImageCircle isImageLoading={isImageLoading}>
          <RequirementImage image={requirement?.data?.customImage || image} />
        </RequirementImageCircle>

        <Circle
          position="absolute"
          right={-1}
          bottom={0}
          bgColor={"white"}
          size={5}
          overflow="hidden"
        >
          <Icon boxSize={3} as={Lightning} weight="fill" color="green.500" />
        </Circle>
      </Box>

      <Flex alignSelf={"center"} flexDir={"column"} justifyContent={"center"} ml={1}>
        {ProvidedValueDisplay && <ProvidedValueDisplay requirement={requirement} />}

        <HStack gap={1} alignItems={"center"}>
          <Text fontSize={"sm"} color={"GrayText"}>
            Via:{" "}
          </Text>
          <Text
            fontWeight={"medium"}
            sx={{ fontSize: "sm", "& *": { fontSize: "inherit" } }}
          >
            {requirement?.data?.customName || children}
          </Text>
        </HStack>
      </Flex>
      {rightElement}
    </SimpleGrid>
  )
}

export default DataProviderRequirement
