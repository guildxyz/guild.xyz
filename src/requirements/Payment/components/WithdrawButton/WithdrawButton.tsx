import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { LinkBreak, Wallet } from "phosphor-react"
import useVault from "requirements/Payment/hooks/useVault"
import shortenHex from "utils/shortenHex"
import useWithdraw from "./hooks/useWithdraw"

const WithdrawButton = (): JSX.Element => {
  const { address, chain, data } = useRequirementContext()
  const {
    data: { owner, token, collected },
  } = useVault(address, data?.id, chain)
  const {
    data: { symbol, decimals },
  } = useTokenData(chain, token)

  const { chainId, account } = useWeb3React()
  const { requestNetworkChange } = useWeb3ConnectionManager()

  const isOnVaultsChain = Chains[chain] === chainId
  const isDisabledLabel =
    collected && collected.eq(BigNumber.from(0))
      ? "Withdrawable amount is 0"
      : owner && owner !== account
      ? `Only the requirement's original creator can withdraw (${shortenHex(owner)})`
      : null

  const formattedWithdrawableAmount =
    collected && decimals && Number(formatUnits(collected, decimals)) * 0.9

  const { onSubmit, isLoading } = useWithdraw(address, data?.id, chain)

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
          : `Switch to ${RPC[chain]?.chainName} to withdraw`}
      </Button>
    </Tooltip>
  )
}

export default WithdrawButton
