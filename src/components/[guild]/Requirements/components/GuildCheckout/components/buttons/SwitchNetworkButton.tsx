import { Collapse } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import { useChainId } from "wagmi"

type Props = {
  targetChainId: number
}

const SwitchNetworkButton = ({ targetChainId }: Props): JSX.Element => {
  const chainId = useChainId()

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
