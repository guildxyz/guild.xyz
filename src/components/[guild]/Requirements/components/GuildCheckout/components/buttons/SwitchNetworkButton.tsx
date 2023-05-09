import { Collapse } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"

type Props = {
  targetChainId: number
}

const SwitchNetworkButton = ({ targetChainId }: Props): JSX.Element => {
  const { chainId } = useWeb3React()

  const { requestNetworkChange, isNetworkChangeInProgress } =
    useWeb3ConnectionManager()

  return (
    <Collapse in={chainId !== targetChainId}>
      <Button
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
