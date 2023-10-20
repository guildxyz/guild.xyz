import { Icon } from "@chakra-ui/react"
import { CHAIN_CONFIG } from "chains"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import BuyPass from "components/[guild]/Requirements/components/GuildCheckout/BuyPass"
import { GuildCheckoutProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useTokenData from "hooks/useTokenData"
import { Coins } from "phosphor-react"
import { formatUnits } from "viem"
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

  const {
    data: { symbol, decimals },
    error: tokenError,
    isValidating: isTokenDataLoading,
  } = useTokenData(chain, token)
  const convertedFee = fee && decimals ? formatUnits(fee, decimals) : undefined

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
        {"Pay "}
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
        {` on ${CHAIN_CONFIG[chain].name}`}
      </>
    </Requirement>
  )
}

export default PaymentRequirement
