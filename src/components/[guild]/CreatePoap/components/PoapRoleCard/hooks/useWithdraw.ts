import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"

const useWithDraw = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const feeCollectorContract = useFeeCollectorContract()

  const fetchWithdraw = async (vaultId: number) => {
    try {
      await feeCollectorContract.callStatic?.withdraw(vaultId)
    } catch (callStaticError) {
      return Promise.reject(
        callStaticError.errorName === "TransferFailed"
          ? "Transfer failed"
          : "Contract error"
      )
    }

    const withdrawRes = await feeCollectorContract?.withdraw(vaultId)
    return withdrawRes?.wait()
  }

  return useSubmit<number, any>(fetchWithdraw, {
    onError: (error) => showErrorToast(error?.message ?? error),
    onSuccess: () =>
      toast({
        title: "Successful withdraw",
        status: "success",
      }),
  })
}

export default useWithDraw
