import { HStack, Text, useColorModeValue } from "@chakra-ui/react"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import useTokenData from "hooks/useTokenData"
import { ProvidedValueDisplayProps } from "requirements"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"

const TokenProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const {
    data: { symbol },
  } = useTokenData(requirement?.chain, requirement?.address ?? NULL_ADDRESS)

  const tagBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>{symbol ?? "Token"} balance</Text>
      <RequirementChainIndicator bg={tagBg} chain={requirement?.chain} />
    </HStack>
  )
}

export default TokenProvidedValue
