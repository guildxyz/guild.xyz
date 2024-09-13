import { Icon, Text } from "@chakra-ui/react"
import { Coins, Warning } from "@phosphor-icons/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import BuyPass from "components/[guild]/Requirements/components/GuildCheckout/BuyPass"
import { GuildCheckoutProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContext"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import DataBlock from "components/common/DataBlock"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useToken from "hooks/useToken"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import PaymentTransactionStatusModal from "../../components/[guild]/Requirements/components/GuildCheckout/components/PaymentTransactionStatusModal"
import WithdrawButton from "./components/WithdrawButton"
import useVault from "./hooks/useVault"

const OriginalPaymentRequirement = (props: RequirementProps): JSX.Element => {
  const { isAdmin } = useGuildPermission()

  const {
    id,
    roleId,
    chain,
    address,
    data: requirementData,
  } = useRequirementContext<"PAYMENT">()
  const {
    token,
    fee,
    multiplePayments,
    isLoading: isVaultLoading,
    error: vaultError,
  } = useVault(address as `0x${string}`, requirementData?.id, chain)

  const isNativeCurrency = token === NULL_ADDRESS

  const {
    data: tokenData,
    error: tokenError,
    isLoading: isTokenDataLoading,
  } = useToken({
    address: token,
    chainId: Chains[chain],
    shouldFetch: Boolean(!isNativeCurrency && chain),
  })

  const convertedFee = fee
    ? isNativeCurrency
      ? formatUnits(fee, CHAIN_CONFIG[chain].nativeCurrency.decimals)
      : tokenData?.decimals
        ? formatUnits(fee, tokenData.decimals)
        : undefined
    : undefined

  const symbol = isNativeCurrency
    ? CHAIN_CONFIG[chain].nativeCurrency.symbol
    : tokenData?.symbol

  const { reqAccesses } = useRoleMembership(roleId ?? 0)

  const satisfiesRequirement = reqAccesses?.find(
    (req) => req.requirementId === id
  )?.access

  return (
    <Requirement
      image={<Icon as={Coins} boxSize={6} />}
      {...props}
      rightElement={
        props?.rightElement ? (
          <GuildCheckoutProvider>
            {satisfiesRequirement && !multiplePayments ? (
              props?.rightElement
            ) : (
              <BuyPass />
            )}
            <PaymentTransactionStatusModal />
          </GuildCheckoutProvider>
        ) : null
      }
      footer={
        <>
          {isAdmin ? (
            <WithdrawButton />
          ) : token ? (
            <BlockExplorerUrl chain={chain} address={token} />
          ) : null}
        </>
      }
    >
      <>
        <Text as="span">{"Pay "}</Text>
        <DataBlock
          isLoading={isVaultLoading || isTokenDataLoading}
          error={
            vaultError
              ? "Couldn't fetch vault"
              : tokenError
                ? "Couldn't fetch token info"
                : undefined
          }
        >
          {convertedFee && symbol ? `${convertedFee} ${symbol}` : "-"}
        </DataBlock>
        <Text as="span">{` on ${CHAIN_CONFIG[chain].name}`}</Text>
      </>
    </Requirement>
  )
}

const PaymentRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext()
  return (
    <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
      {`Unsupported requirement type: `}
      <DataBlock>{type}</DataBlock>
    </Requirement>
  )
}

export default PaymentRequirement
