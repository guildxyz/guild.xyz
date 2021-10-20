import { Text } from "@chakra-ui/react"
import { RequirementType, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirementType: RequirementType
}

const RequirementTypeText = ({ requirementType }: Props): JSX.Element => {
  return (
    <Text
      as="span"
      mt={4}
      pt={2}
      w="full"
      fontSize="sm"
      textAlign="center"
      color={RequirementTypeColors[requirementType]}
      textTransform="uppercase"
      fontWeight="extrabold"
      borderTopWidth={2}
      borderTopColor="blackAlpha.300"
      borderTopStyle="dashed"
    >
      {requirementType}
    </Text>
  )
}

export default RequirementTypeText
