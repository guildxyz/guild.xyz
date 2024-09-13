import { Text } from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useTokenData from "hooks/useTokenData"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"

type Props = RequirementProps

const TokenRequirement = ({ ...rest }: Props) => {
  const requirement = useRequirementContext()

  // TODO: we could remove the cast once we'll have schemas for "ERC..." requirements
  const requirementChain = requirement.chain as Chain
  const requirementAddress = requirement.address as `0x${string}`

  const { data, isValidating } = useTokenData(requirementChain, requirementAddress)

  return (
    <Requirement
      image={
        requirement.type === "COIN"
          ? CHAIN_CONFIG[requirementChain]?.nativeCurrency?.iconUrl
          : (data?.logoURI ?? (
              <Text as="span" fontWeight="bold" fontSize="xx-small">
                ERC20
              </Text>
            ))
      }
      isImageLoading={isValidating}
      footer={
        requirement?.type === "ERC20" ? (
          // This feature is temporarily disabled
          // <HStack spacing="4">
          //   <GuildCheckoutProvider>
          //     <DynamicPurchaseRequirement />
          //     <PurchaseTransactionStatusModal />
          //   </GuildCheckoutProvider>
          //   <BlockExplorerUrl />
          // </HStack>
          <BlockExplorerUrl />
        ) : requirement?.type === "COIN" ? (
          <RequirementChainIndicator />
        ) : null
      }
      {...rest}
    >
      {`Hold ${
        requirement.data?.maxAmount
          ? `${requirement.data.minAmount} - ${requirement.data.maxAmount}`
          : requirement.data?.minAmount > 0
            ? `at least ${requirement.data?.minAmount}`
            : "any amount of"
      } ${
        requirement.type === "COIN"
          ? CHAIN_CONFIG[requirementChain].nativeCurrency.symbol
          : (data?.symbol ?? requirement.symbol)
      }`}
    </Requirement>
  )
}

export default TokenRequirement
