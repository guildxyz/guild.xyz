import { HStack, Text } from "@chakra-ui/react"
import { RequirementChainIndicator } from "components/[guild]/Requirements/components/RequirementChainIndicator"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"

const TxCountProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => (
  <HStack wrap={"wrap"} gap={1}>
    <Text>Number of transactions</Text>
    <RequirementChainIndicator chain={requirement?.chain} />
  </HStack>
)

export default TxCountProvidedValue
