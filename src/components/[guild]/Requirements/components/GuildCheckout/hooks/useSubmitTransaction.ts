// WAGMI TODO
// import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import useSubmit, { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { Rest } from "types"
import { useTransactionStatusContext } from "../components/TransactionStatusContext"

const useSubmitTransaction = <DataType>(
  // sendTransaction: (data?: DataType) => Promise<TransactionResponse>,
  sendTransaction: (data?: DataType) => Promise<any>,
  // { onSuccess, onError }: UseSubmitOptions<TransactionReceipt & Rest> = {}
  { onSuccess, onError }: UseSubmitOptions<Rest> = {}
) => {
  const { setTxHash, txHash, setTxError, setTxSuccess } =
    useTransactionStatusContext() ?? {}

  const fetch = async (data?: DataType) => {
    const transaction = await sendTransaction(data)
    setTxHash?.(transaction.hash)
    return transaction.wait()
  }

  return useSubmit(fetch, {
    onError: (error) => {
      const prettyError =
        error?.code === "ACTION_REJECTED" ? "User rejected the transaction" : error
      if (txHash) setTxError?.(true)
      onError?.(prettyError)
    },
    onSuccess: (receipt) => {
      if (receipt.status !== 1) {
        setTxError?.(true)
        console.log("TX RECEIPT", receipt)
        return
      }
      onSuccess?.(receipt)
      setTxSuccess?.(true)
    },
  })
}

export default useSubmitTransaction
