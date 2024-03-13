import { CHAIN_CONFIG, Chains } from "chains"
import { useSwitchChain } from "wagmi"
import useToast from "./useToast"

const useTriggerNetworkChange = () => {
  const toast = useToast()
  const { switchChainAsync, isPending } = useSwitchChain()

  const requestNetworkChange = async (
    newChainId: number,
    callback?: () => void,
    errorHandler?: (err: unknown) => void
  ) => {
    if (!switchChainAsync) {
      toast({
        title: "Your wallet doesn't support switching chains automatically",
        description: `Please switch to ${
          CHAIN_CONFIG[Chains[newChainId]].name
        } from your wallet manually!`,
        status: "info",
      })
    } else {
      switchChainAsync({
        chainId: newChainId,
      })
        .then(() => callback?.())
        .catch(errorHandler)
    }
  }

  return { requestNetworkChange, isNetworkChangeInProgress: isPending }
}

export default useTriggerNetworkChange
