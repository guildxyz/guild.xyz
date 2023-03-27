import { useWeb3React } from "@web3-react/core"
import { Chain, Chains } from "connectors"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useVault from "requirements/Payment/hooks/useVault"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"

const useWithdraw = (contractAddress: string, vaultId: number, chain: Chain) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { chainId } = useWeb3React()

  const feeCollectorContract = useContract(
    Chains[chain] === chainId ? contractAddress : null,
    FEE_COLLECTOR_ABI,
    true
  )

  const { mutate } = useVault(contractAddress, vaultId, chain)

  const withdraw = async () => {
    if (!feeCollectorContract)
      return Promise.reject("Couldn't find FeeCollector contract.")

    try {
      await feeCollectorContract.callStatic.withdraw(vaultId)
    } catch (callStaticError) {
      return Promise.reject(
        callStaticError.errorName === "TransferFailed"
          ? "Transfer failed"
          : "Contract error"
      )
    }

    const withdrawRes = await feeCollectorContract.withdraw(vaultId)
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
      mutate()
    },
  })
}

export default useWithdraw
