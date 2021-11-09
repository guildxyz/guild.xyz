import { Text } from "@chakra-ui/react"
import { RequirementType, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirementType: RequirementType
}

const RequirementTypeText = ({ requirementType }: Props): JSX.Element => (
  <Text
    as="span"
    position="absolute"
    top={0}
    left={0}
    px={2}
    py={1}
    backgroundColor={RequirementTypeColors[requirementType]}
    fontSize="sm"
    textAlign="center"
    color={requirementType === "WHITELIST" ? "gray.800" : "blackAlpha.600"}
    textTransform="uppercase"
    fontWeight="extrabold"
    borderBottomRightRadius={"lg"}
  >
    {requirementType}
  </Text>
)

export default RequirementTypeText
