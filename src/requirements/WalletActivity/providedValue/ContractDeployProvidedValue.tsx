import { HStack, Text } from "@chakra-ui/react"
import { RequirementChainIndicator } from "components/[guild]/Requirements/components/RequirementChainIndicator"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"

const ContractDeployProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => (
  <HStack wrap={"wrap"} gap={1}>
    <Text>Deployed contracts</Text>
    <RequirementChainIndicator chain={requirement?.chain} className="inline-flex" />
  </HStack>
)

export default ContractDeployProvidedValue
