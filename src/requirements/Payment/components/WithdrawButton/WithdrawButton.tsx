import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains } from "chains"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import useTokenData from "hooks/useTokenData"
import { LinkBreak, Wallet } from "phosphor-react"
import useVault from "requirements/Payment/hooks/useVault"
import shortenHex from "utils/shortenHex"
import { formatUnits } from "viem"
import { useAccount, useChainId } from "wagmi"
import useWithdraw from "./hooks/useWithdraw"

const WithdrawButton = (): JSX.Element => {
  const { address: vaultAddress, chain, data } = useRequirementContext()
  const { owner, token, balance } = useVault(vaultAddress, data?.id, chain)
  const {
    data: { symbol, decimals },
  } = useTokenData(chain, token)

  const { address } = useAccount()
  const chainId = useChainId()
  const { requestNetworkChange } = useWeb3ConnectionManager()

  const isOnVaultsChain = Chains[chain] === chainId
  const isDisabledLabel =
    balance === BigInt(0)
      ? "Withdrawable amount is 0"
      : owner && owner !== address
      ? `Only the requirement's original creator can withdraw (${shortenHex(owner)})`
      : null

  const formattedWithdrawableAmount =
    balance && decimals && Number(formatUnits(balance, decimals)) * 0.9

  const { onSubmit, isLoading } = useWithdraw(vaultAddress, data?.id, chain)

  return (
    <Tooltip
      label={isDisabledLabel}
      isDisabled={!isDisabledLabel}
      hasArrow
      placement="right"
    >
      <Button
        size="xs"
        borderRadius="md"
        leftIcon={
          isLoading ? (
            <Spinner size="xs" />
          ) : (
            <Icon as={isDisabledLabel || isOnVaultsChain ? Wallet : LinkBreak} />
          )
        }
        isDisabled={isLoading || isDisabledLabel}
        onClick={
          isOnVaultsChain ? onSubmit : () => requestNetworkChange(Chains[chain])
        }
      >
        {isLoading
          ? "Withdrawing"
          : isDisabledLabel || !formattedWithdrawableAmount
          ? "Withdraw"
          : isOnVaultsChain
          ? `Withdraw ${
              formattedWithdrawableAmount < 0.001
                ? "< 0.001"
                : formattedWithdrawableAmount.toFixed(3)
            } ${symbol}`
          : `Switch to ${CHAIN_CONFIG[chain].name} to withdraw`}
      </Button>
    </Tooltip>
  )
}

export default WithdrawButton
