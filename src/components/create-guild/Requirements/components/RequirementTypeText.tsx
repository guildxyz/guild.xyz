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
    px={4}
    py={1}
    backgroundColor={RequirementTypeColors[requirementType]}
    color={requirementType === "WHITELIST" ? "gray.700" : "blackAlpha.600"}
    fontSize="sm"
    textTransform="uppercase"
    fontWeight="extrabold"
    {...rest}
  >
    {requirementType}
  </Text>
)

export default RequirementTypeText
