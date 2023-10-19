import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import { Wallet } from "phosphor-react"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useChainId } from "wagmi"
import useWithDraw from "../../../hooks/useWithdraw"
import ActionButton from "../../ActionButton"

type Props = {
  label: string
  chainId?: number
  vaultId?: number
  asMenuItem?: boolean
  isDisabled?: boolean
  setIsLoading?: Dispatch<SetStateAction<boolean>>
  onComplete?: () => void
}

const WithdrawButton = ({
  label,
  chainId,
  vaultId,
  isDisabled,
  setIsLoading,
  onComplete,
}: Props): JSX.Element => {
  const usersChainId = useChainId()
  const { requestNetworkChange } = useWeb3ConnectionManager()

  const { onSubmit, response, isLoading } = useWithDraw()

  useEffect(() => setIsLoading?.(isLoading), [isLoading])

  useEffect(() => {
    if (!response) return
    onComplete?.()
  }, [response])

  return (
    <ActionButton
      leftIcon={Wallet}
      isDisabled={isDisabled}
      onClick={
        isDisabled
          ? undefined
          : chainId !== usersChainId
          ? () => requestNetworkChange(chainId)
          : () => onSubmit(vaultId)
      }
      isLoading={isLoading}
      loadingText="Withdrawing funds"
    >
      {chainId && chainId !== usersChainId
        ? `Withdraw on ${RPC[Chains[chainId]]?.chainName}`
        : label}
    </ActionButton>
  )
}

export default WithdrawButton
