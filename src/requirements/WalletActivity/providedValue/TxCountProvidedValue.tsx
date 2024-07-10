import { HStack, Text, useColorModeValue } from "@chakra-ui/react"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"

const TxCountProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const tagBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>Number of transactions</Text>
      <RequirementChainIndicator bg={tagBg} chain={requirement?.chain} />
    </HStack>
  )
}

export default TxCountProvidedValue
