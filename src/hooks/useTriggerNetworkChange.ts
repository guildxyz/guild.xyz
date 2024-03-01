import { CHAIN_CONFIG, Chains } from "chains"
import { useSwitchNetwork } from "wagmi"
import useToast from "./useToast"

const useTriggerNetworkChange = () => {
  const toast = useToast()
  const { switchNetworkAsync, isLoading } = useSwitchNetwork()

  const requestNetworkChange = async (
    newChainId: number,
    callback?: () => void,
    errorHandler?: (err: unknown) => void,
  ) => {
    if (!switchNetworkAsync) {
      toast({
        title: "Your wallet doesn't support switching chains automatically",
        description: `Please switch to ${
          CHAIN_CONFIG[Chains[newChainId]].name
        } from your wallet manually!`,
        status: "info",
      })
    } else {
      switchNetworkAsync(newChainId)
        .then(() => callback?.())
        .catch(errorHandler)
    }
  }

  return { requestNetworkChange, isNetworkChangeInProgress: isLoading }
}

export default useTriggerNetworkChange
