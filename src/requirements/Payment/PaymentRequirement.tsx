import { Icon, Text } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains } from "chains"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import BuyPass from "components/[guild]/Requirements/components/GuildCheckout/BuyPass"
import { GuildCheckoutProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import DataBlock from "components/common/DataBlock"
import { Coins } from "phosphor-react"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { useToken } from "wagmi"
import PaymentTransactionStatusModal from "../../components/[guild]/Requirements/components/GuildCheckout/components/PaymentTransactionStatusModal"
import WithdrawButton from "./components/WithdrawButton"
import useVault from "./hooks/useVault"

const PaymentRequirement = (props: RequirementProps): JSX.Element => {
  const { isAdmin } = useGuildPermission()

  const {
    id,
    roleId,
    poapId,
    chain,
    address,
    data: requirementData,
  } = useRequirementContext()
  const {
    token,
    fee,
    multiplePayments,
    isLoading: isVaultLoading,
    error: vaultError,
  } = useVault(address, requirementData?.id, chain)

  const isNativeCurrency = token === NULL_ADDRESS

  const {
    data: tokenData,
    error: tokenError,
    isLoading: isTokenDataLoading,
  } = useToken({
    address: token,
    chainId: Chains[chain],
    enabled: Boolean(!isNativeCurrency && chain),
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

  const { data: accessData } = useAccess(roleId ?? 0)
  // temporary until POAPs are real roles
  const { data: poapAccessData } = useUserPoapEligibility(poapId)
  const { poapLinks } = usePoapLinks(poapId)

  const satisfiesRequirement = (accessData || poapAccessData)?.requirements?.find(
    (req) => req.requirementId === id
  )?.access

  return (
    <Requirement
      image={<Icon as={Coins} boxSize={6} />}
      {...props}
      rightElement={
        props?.rightElement ? (
          <GuildCheckoutProvider>
            {(satisfiesRequirement && !multiplePayments) ||
            (poapLinks && poapLinks?.claimed === poapLinks?.total) ? (
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

export default PaymentRequirement
