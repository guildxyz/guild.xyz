import { Collapse } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"

const SwitchNetworkButton = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { chain } = useRequirementContext()
  const requirementChainId = Chains[chain]

  const { requestNetworkChange, isNetworkChangeInProgress } =
    useWeb3ConnectionManager()

  return (
    <Collapse in={chainId !== requirementChainId}>
      <Button
        size="lg"
        colorScheme="blue"
        isLoading={isNetworkChangeInProgress}
        loadingText="Check your wallet"
        onClick={() => requestNetworkChange(requirementChainId)}
        w="full"
      >
        Switch network
      </Button>
    </Collapse>
  )
}

export default SwitchNetworkButton
