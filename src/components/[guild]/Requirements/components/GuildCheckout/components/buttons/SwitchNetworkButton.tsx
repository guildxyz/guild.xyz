import { Collapse } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"

type Props = {
  targetChainId: number
}

const SwitchNetworkButton = ({ targetChainId }: Props): JSX.Element => {
  const { addDatadogAction, addDatadogError } = useDatadog()

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
        onClick={() =>
          requestNetworkChange(
            targetChainId,
            () => addDatadogAction("changed network (GuildCheckout)"),
            () => addDatadogError("network change error (GuildCheckout)")
          )
        }
        w="full"
        data-dd-action-name="SwitchNetworkButton (GuildCheckout)"
      >
        Switch network
      </Button>
    </Collapse>
  )
}

export default SwitchNetworkButton
