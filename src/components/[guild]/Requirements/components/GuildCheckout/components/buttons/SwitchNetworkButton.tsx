import { Collapse } from "@chakra-ui/react"
import Button from "components/common/Button"
import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
import { useAccount } from "wagmi"

type Props = {
  targetChainId: number
  hidden?: boolean
}

const SwitchNetworkButton = ({ targetChainId, hidden }: Props): JSX.Element => {
  const { isConnected, chainId } = useAccount()

  const { requestNetworkChange, isNetworkChangeInProgress } =
    useTriggerNetworkChange()

  return (
    <Collapse in={!hidden && isConnected && chainId !== targetChainId}>
      <Button
        data-test="switch-network-button"
        size="lg"
        colorScheme="blue"
        isLoading={isNetworkChangeInProgress}
        loadingText="Check your wallet"
        flexShrink={0}
        onClick={() => requestNetworkChange(targetChainId)}
        w="full"
      >
        Switch network
      </Button>
    </Collapse>
  )
}

export default SwitchNetworkButton
