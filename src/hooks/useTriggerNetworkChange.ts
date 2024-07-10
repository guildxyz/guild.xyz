import { useToast } from "@/components/ui/hooks/useToast"
import { useSwitchChain } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"

const useTriggerNetworkChange = () => {
  const { toast } = useToast()
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
        variant: "info",
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
