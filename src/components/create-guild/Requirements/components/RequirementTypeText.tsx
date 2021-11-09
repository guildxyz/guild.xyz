import { Text } from "@chakra-ui/react"
import { RequirementType, RequirementTypeColors } from "temporaryData/types"
import { Rest } from "types"

type Props = {
  requirementType: RequirementType
} & Rest

const RequirementTypeText = ({ requirementType, ...rest }: Props): JSX.Element => (
  <Text
    as="span"
    position="absolute"
    px={2}
    py={1}
    backgroundColor={RequirementTypeColors[requirementType]}
    fontSize="sm"
    textAlign="center"
    color={requirementType === "WHITELIST" ? "gray.800" : "blackAlpha.600"}
    textTransform="uppercase"
    fontWeight="extrabold"
    {...rest}
  >
    {requirementType}
  </Text>
)

export default RequirementTypeText
