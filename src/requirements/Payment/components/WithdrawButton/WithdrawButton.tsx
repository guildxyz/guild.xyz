import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import { LinkBreak, Wallet } from "phosphor-react"
import useVault from "requirements/Payment/hooks/useVault"
import useWithdraw from "./hooks/useWithdraw"

const WithdrawButton = (): JSX.Element => {
  const { chain, data } = useRequirementContext()
  const {
    data: { collected },
  } = useVault(data?.id, chain)

  const { chainId } = useWeb3React()
  const { requestNetworkChange } = useWeb3ConnectionManager()

  const isOnVaultsChain = Chains[chain] === chainId
  const isButtonDisabled = collected && collected.eq(BigNumber.from(0))

  const { onSubmit, isLoading } = useWithdraw(data?.id, chain)

  return (
    <Tooltip
      label="Withdrawable amount is 0"
      isDisabled={!isButtonDisabled}
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
            <Icon as={isButtonDisabled || isOnVaultsChain ? Wallet : LinkBreak} />
          )
        }
        isDisabled={isLoading || isButtonDisabled}
        onClick={
          isOnVaultsChain ? onSubmit : () => requestNetworkChange(Chains[chain])
        }
      >
        {isLoading
          ? "Withdrawing"
          : isButtonDisabled || isOnVaultsChain
          ? "Withdraw"
          : `Switch to ${RPC[chain]?.chainName} to withdraw`}
      </Button>
    </Tooltip>
  )
}

export default WithdrawButton
