import { Box, Text } from "@chakra-ui/react"
import { RequirementType, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirementType: RequirementType
}

const RequirementTypeText = ({ requirementType }: Props): JSX.Element => (
  <Box mt="auto" ml={{ base: -5, md: -7 }} pt={4}>
    <Text
      as="span"
      px={2}
      py={1}
      mt="auto"
      width="full"
      backgroundColor={RequirementTypeColors[requirementType]}
      fontSize="sm"
      textAlign="center"
      color={requirementType === "WHITELIST" ? "gray.800" : "blackAlpha.600"}
      textTransform="uppercase"
      fontWeight="extrabold"
      borderTopRightRadius={"lg"}
    >
      {requirementType}
    </Text>
  </Box>
)

export default RequirementTypeText
