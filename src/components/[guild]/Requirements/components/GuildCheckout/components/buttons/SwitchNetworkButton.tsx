import { Collapse } from "@chakra-ui/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { useAccount, useChainId } from "wagmi"

type Props = {
  targetChainId: number
  hidden?: boolean
}

const SwitchNetworkButton = ({ targetChainId, hidden }: Props): JSX.Element => {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const { requestNetworkChange, isNetworkChangeInProgress } =
    useWeb3ConnectionManager()

  return (
    <Collapse in={!hidden && isConnected && chainId !== targetChainId}>
      <Button
        data-test="switch-network-button"
        size="lg"
        colorScheme="blue"
        isLoading={isNetworkChangeInProgress}
        loadingText="Check your wallet"
        onClick={() => requestNetworkChange(targetChainId)}
        w="full"
      >
        Switch network
      </Button>
    </Collapse>
  )
}

export default SwitchNetworkButton
