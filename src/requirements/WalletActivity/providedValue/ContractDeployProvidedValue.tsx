import { HStack, Text, useColorModeValue } from "@chakra-ui/react"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"

const ContractDeployProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const tagBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>Deployed contracts</Text>
      <RequirementChainIndicator
        bg={tagBg}
        chain={requirement?.chain}
        display={"inline"}
      />
    </HStack>
  )
}

export default ContractDeployProvidedValue
