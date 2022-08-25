import { MenuItem, Tooltip, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { Wallet } from "phosphor-react"
import { useEffect } from "react"
import useWithDraw from "../../../hooks/useWithdraw"
import ActionButton from "../../ActionButton"

type Props = {
  label: string
  chainId?: number
  vaultId?: number
  asMenuItem?: boolean
  isDisabled?: boolean
  onComplete?: () => void
}

const WithdrawButton = ({
  label,
  chainId,
  vaultId,
  asMenuItem,
  isDisabled,
  onComplete,
}: Props): JSX.Element => {
  const { chainId: usersChainId } = useWeb3React()
  const { colorMode } = useColorMode()
  const { onSubmit, response } = useWithDraw()

  useEffect(() => {
    if (!response) return
    onComplete?.()
  }, [response])

  if (asMenuItem)
    return (
      <Tooltip
        label={`Switch to ${RPC[Chains[chainId]]?.chainName}`}
        isDisabled={chainId === usersChainId}
        shouldWrapChildren
      >
        <MenuItem
          onClick={
            isDisabled || chainId !== usersChainId
              ? undefined
              : () => onSubmit(vaultId)
          }
          isDisabled={isDisabled || chainId !== usersChainId}
          fontSize="sm"
        >
          {label}
        </MenuItem>
      </Tooltip>
    )

  return (
    <Tooltip
      label={!isDisabled && `Switch to ${RPC[Chains[chainId]]?.chainName}`}
      isDisabled={chainId === usersChainId}
      shouldWrapChildren
    >
      <ActionButton
        leftIcon={Wallet}
        isDisabled={isDisabled || chainId !== usersChainId}
        onClick={isDisabled ? undefined : () => onSubmit(vaultId)}
      >
        {label}
      </ActionButton>
    </Tooltip>
  )
}

export default WithdrawButton
