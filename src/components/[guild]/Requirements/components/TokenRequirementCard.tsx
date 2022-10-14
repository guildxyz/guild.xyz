import { Text } from "@chakra-ui/react"
import useTokens from "hooks/useTokens"
import { Requirement } from "types"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TokenRequirementCard = ({ requirement }: Props) => {
  const { tokens, isLoading } = useTokens(requirement.chain)
  const foundToken = tokens?.find((token) => token.address === requirement.address)

  return (
    <RequirementCard
      requirement={requirement}
      image={
        foundToken?.logoURI ?? (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            ERC20
          </Text>
        )
      }
      loading={!foundToken && isLoading}
      footer={
        requirement?.type === "ERC20" && (
          <BlockExplorerUrl requirement={requirement} />
        )
      }
    >
      {`Hold ${
        requirement.data?.maxAmount
          ? `${requirement.data.minAmount} - ${requirement.data.maxAmount}`
          : requirement.data?.minAmount > 0
          ? `at least ${requirement.data?.minAmount}`
          : "any amount of"
      } ${requirement.symbol ?? foundToken?.symbol}`}
    </RequirementCard>
  )
}

export default TokenRequirementCard
