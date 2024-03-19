import { HStack, Text } from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import DynamicPurchaseRequirement from "components/[guild]/Requirements/components/GuildCheckout/DynamicPurchaseRequirement"
import { GuildCheckoutProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContext"
import PurchaseTransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/PurchaseTransactionStatusModal"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useTokenData from "hooks/useTokenData"
import { CHAIN_CONFIG } from "wagmiConfig/chains"

type Props = RequirementProps

const TokenRequirement = ({ ...rest }: Props) => {
  const requirement = useRequirementContext()

  const { data, isValidating } = useTokenData(requirement.chain, requirement.address)

  return (
    <Requirement
      image={
        requirement.type === "COIN"
          ? CHAIN_CONFIG[requirement.chain]?.nativeCurrency?.iconUrl
          : data?.logoURI ?? (
              <Text as="span" fontWeight="bold" fontSize="xx-small">
                ERC20
              </Text>
            )
      }
      isImageLoading={isValidating}
      footer={
        requirement?.type === "ERC20" ? (
          <HStack spacing="4">
            <GuildCheckoutProvider>
              <DynamicPurchaseRequirement />
              <PurchaseTransactionStatusModal />
            </GuildCheckoutProvider>
            <BlockExplorerUrl />
          </HStack>
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
          ? CHAIN_CONFIG[requirement.chain].nativeCurrency.symbol
          : data?.symbol ?? requirement.symbol
      }`}
    </Requirement>
  )
}

export default TokenRequirement
