import { Icon, MenuItem, Tooltip, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"
import { Wallet } from "phosphor-react"
import { useEffect } from "react"
import useWithDraw from "../../../hooks/useWithdraw"

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
      <Button
        leftIcon={<Icon as={Wallet} />}
        size="xs"
        rounded="lg"
        borderWidth={colorMode === "light" ? 2 : 0}
        borderColor="gray.200"
        isDisabled={isDisabled || chainId !== usersChainId}
        onClick={isDisabled ? undefined : () => onSubmit(vaultId)}
      >
        {label}
      </Button>
    </Tooltip>
  )
}

export default WithdrawButton
