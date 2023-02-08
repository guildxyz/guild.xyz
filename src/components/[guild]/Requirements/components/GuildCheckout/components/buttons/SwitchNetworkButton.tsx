import Button from "components/common/Button"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"

const SwitchNetworkButton = (): JSX.Element => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const { chain } = useRequirementContext()
  const requirementChainId = Chains[chain]

  const { requestNetworkChange, newtowrkChangeInProgress } =
    useWeb3ConnectionManager()

  return (
    <Button
      size="lg"
      colorScheme="blue"
      isLoading={newtowrkChangeInProgress}
      loadingText="Check your wallet"
      onClick={() =>
        requestNetworkChange(
          requirementChainId,
          () => addDatadogAction("changed network (GuildCheckout)"),
          () => addDatadogError("network change error (GuildCheckout)")
        )
      }
      w="full"
      data-dd-action-name="SwitchNetworkButton (GuildCheckout)"
    >
      Switch network
    </Button>
  )
}

export default SwitchNetworkButton
