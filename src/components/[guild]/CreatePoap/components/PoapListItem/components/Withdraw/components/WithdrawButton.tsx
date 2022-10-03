import { MenuItem } from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import requestNetworkChange from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import { Chains, RPC } from "connectors"
import useToast from "hooks/useToast"
import { Wallet } from "phosphor-react"
import { Dispatch, SetStateAction, useEffect } from "react"
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
  asMenuItem,
  isDisabled,
  setIsLoading,
  onComplete,
}: Props): JSX.Element => {
  const { chainId: usersChainId, connector } = useWeb3React()
  const { onSubmit, response, isLoading } = useWithDraw()

  useEffect(() => setIsLoading?.(isLoading), [isLoading])

  useEffect(() => {
    if (!response) return
    onComplete?.()
  }, [response])

  const toast = useToast()

  const networkChangeHandler = () => {
    if (connector instanceof WalletConnect || connector instanceof CoinbaseWallet) {
      toast({
        title: "Your wallet doesn't support switching chains automatically",
        description: `Please switch to ${
          RPC[Chains[chainId]]?.chainName
        } from your wallet manually!`,
        status: "error",
      })
      return
    }

    requestNetworkChange(Chains[chainId])()
  }

  if (asMenuItem)
    return (
      <MenuItem
        onClick={
          isDisabled
            ? undefined
            : chainId !== usersChainId
            ? networkChangeHandler
            : () => onSubmit(vaultId)
        }
        isDisabled={isDisabled}
        fontSize="sm"
      >
        {label}
      </MenuItem>
    )

  return (
    <ActionButton
      leftIcon={Wallet}
      isDisabled={isDisabled}
      onClick={
        isDisabled
          ? undefined
          : chainId !== usersChainId
          ? networkChangeHandler
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
