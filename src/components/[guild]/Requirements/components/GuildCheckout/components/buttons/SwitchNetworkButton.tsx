import { Collapse } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"
import { usePostHog } from "posthog-js/react"

const SwitchNetworkButton = (): JSX.Element => {
  const { addDatadogAction, addDatadogError } = useDatadog()
  const posthog = usePostHog()

  const { chainId } = useWeb3React()
  const { chain } = useRequirementContext()
  const requirementChainId = Chains[chain]

  const { requestNetworkChange, isNetworkChangeInProgress } =
    useWeb3ConnectionManager()

  const onClick = () => {
    posthog.capture("Click: SwitchNetworkButton (GuildCheckout)")
    requestNetworkChange(
      requirementChainId,
      () => {
        addDatadogAction("changed network (GuildCheckout)")
        posthog.capture("Changed network (GuildCheckout)")
      },
      () => {
        addDatadogError("network change error (GuildCheckout)")
        posthog.capture("Network change error (GuildCheckout)")
      }
    )
  }

  return (
    <Collapse in={chainId !== requirementChainId}>
      <Button
        size="lg"
        colorScheme="blue"
        isLoading={isNetworkChangeInProgress}
        loadingText="Check your wallet"
        onClick={onClick}
        w="full"
        data-dd-action-name="SwitchNetworkButton (GuildCheckout)"
      >
        Switch network
      </Button>
    </Collapse>
  )
}

export default SwitchNetworkButton
