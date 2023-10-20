import { Chain } from "chains"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useVault from "requirements/Payment/hooks/useVault"
import { useChainId } from "wagmi"

const LEGACY_CONTRACTS: Partial<Record<Chain, string>> = {
  ETHEREUM: "0x13ec6b98362e43add08f7cc4f6befd02fa52ee01",
  POLYGON: "0x13ec6b98362e43add08f7cc4f6befd02fa52ee01",
  GOERLI: "0x32547e6cc18651647e58f57164a0117da82f77f0",
}

const useWithdraw = (
  contractAddress: `0x${string}`,
  vaultId: number,
  chain: Chain
) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const chainId = useChainId()

  const isLegacyContract = contractAddress === LEGACY_CONTRACTS[chain]

  // WAGMI TODO
  // const feeCollectorContract = useContract(
  //   Chains[chain] === chainId ? contractAddress : null,
  //   isLegacyContract ? LEGACY_FEE_COLLECTOR_ABI : FEE_COLLECTOR_ABI,
  //   true
  // )
  const feeCollectorContract = null

  const { refetch } = useVault(contractAddress, vaultId, chain)

  const withdraw = async () => {
    if (!feeCollectorContract)
      return Promise.reject("Couldn't find FeeCollector contract.")

    try {
      await (isLegacyContract
        ? feeCollectorContract.callStatic.withdraw(vaultId)
        : feeCollectorContract.callStatic.withdraw(vaultId, "guild"))
    } catch (callStaticError) {
      return Promise.reject(
        callStaticError.errorName === "TransferFailed"
          ? "Transfer failed"
          : "Contract error"
      )
    }

    const withdrawRes = await (isLegacyContract
      ? feeCollectorContract.withdraw(vaultId)
      : feeCollectorContract.withdraw(vaultId, "guild"))
    return withdrawRes.wait()
  }

  return useSubmit<null, void>(withdraw, {
    onError: (error) => {
      const prettyError =
        error?.code === "ACTION_REJECTED"
          ? "User rejected the transaction"
          : error?.message ?? error
      showErrorToast(prettyError)
    },
    onSuccess: () => {
      toast({
        title: "Successful withdraw",
        status: "success",
      })
      refetch()
    },
  })
}

export default useWithdraw
