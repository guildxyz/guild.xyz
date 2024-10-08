import { HStack, Text } from "@chakra-ui/react"
import { RequirementChainIndicator } from "components/[guild]/Requirements/components/RequirementChainIndicator"
import useTokenData from "hooks/useTokenData"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { Chain } from "wagmiConfig/chains"

const TokenProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  // TODO: we could remove the cast once we'll have schemas for "ERC..." requirements
  const requirementChain = requirement.chain as Chain
  const requirementAddress = requirement.address as `0x${string}`

  const {
    data: { symbol },
  } = useTokenData(requirementChain, requirementAddress ?? NULL_ADDRESS)

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>{symbol ?? "Token"} balance</Text>
      <RequirementChainIndicator chain={requirement?.chain} />
    </HStack>
  )
}

export default TokenProvidedValue
