import { Chain, Chains } from "chains"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useVault from "requirements/Payment/hooks/useVault"
import feeCollectorAbi from "static/abis/feeCollector"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt } from "viem"
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
} from "wagmi"

const useWithdraw = (
  contractAddress: `0x${string}`,
  vaultId: number,
  chain: Chain
) => {
  const publicClient = usePublicClient()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const chainId = useChainId()

  const isOnVaultsChain = Chains[chain] === chainId

  const {
    config,
    isLoading: isPrepareLoading,
    error: rawPrepareError,
  } = usePrepareContractWrite({
    abi: feeCollectorAbi,
    address: contractAddress,
    functionName: "withdraw",
    args: [BigInt(vaultId), "guild"],
    enabled: isOnVaultsChain,
  })

  const { write: withdraw, isLoading } = useContractWrite({
    ...config,
    onError: (error) => {
      const errorMessage = processViemContractError(error)
      showErrorToast(errorMessage)
    },
    onSuccess: async ({ hash }) => {
      const receipt: TransactionReceipt =
        await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status !== "success") {
        showErrorToast("Transaction failed")
        return
      }

      toast({
        title: "Successful withdraw",
        status: "success",
      })
      refetch()
    },
  })

  const { refetch } = useVault(contractAddress, vaultId, chain)

  return {
    isPrepareLoading,
    prepareError: getErrorMessage(rawPrepareError),
    withdraw,
    isLoading,
  }
}

const getErrorMessage = (rawPrepareError: Error) =>
  processViemContractError(rawPrepareError, (errorName) => {
    switch (errorName) {
      case "TransferFailed":
        return "Transfer failed"

      default:
        return "Contract error"
    }
  })

export default useWithdraw
