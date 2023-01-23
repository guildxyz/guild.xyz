import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"
import { useRequirementContext } from "../../../RequirementContext"

const SwitchNetworkButton = (): JSX.Element => {
  const { chain } = useRequirementContext()
  const requirementChainId = Chains[chain]

  const { chainId } = useWeb3React()

  const { requestNetworkChange, newtowrkChangeInProgress } =
    useWeb3ConnectionManager()

  if (chainId === requirementChainId) return null

  return (
    <CardMotionWrapper>
      <Button
        size="xl"
        colorScheme="blue"
        isLoading={newtowrkChangeInProgress}
        loadingText="Check your wallet"
        onClick={() => requestNetworkChange(requirementChainId)}
        w="full"
      >
        Switch network
      </Button>
    </CardMotionWrapper>
  )
}

export default SwitchNetworkButton
