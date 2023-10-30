import { Chain, Chains } from "chains"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import useToast from "hooks/useToast"
import useVault from "requirements/Payment/hooks/useVault"
import feeCollectorAbi from "static/abis/feeCollector"
import { useChainId } from "wagmi"

const useWithdraw = (
  contractAddress: `0x${string}`,
  vaultId: number,
  chain: Chain
) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const chainId = useChainId()

  const isOnVaultsChain = Chains[chain] === chainId

  const { refetch } = useVault(contractAddress, vaultId, chain)

  return useSubmitTransaction(
    {
      abi: feeCollectorAbi,
      address: contractAddress,
      functionName: "withdraw",
      args: [BigInt(vaultId), "guild"],
      enabled: isOnVaultsChain,
    },
    {
      setContext: false,
      customErrorsMap: {
        TransferFailed: "Transfer failed",
      },
      onError: (error) => showErrorToast(error),
      onSuccess: () => {
        toast({
          title: "Successful withdraw",
          status: "success",
        })
        refetch()
      },
    }
  )
}

export default useWithdraw
