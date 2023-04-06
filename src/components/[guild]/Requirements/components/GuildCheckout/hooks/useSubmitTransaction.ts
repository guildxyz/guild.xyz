import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers"
import useSubmit, { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"

const useSubmitTransaction = <DataType>(
  sendTransaction: (data?: DataType) => Promise<TransactionResponse>,
  { onSuccess, onError }: UseSubmitOptions<TransactionReceipt> = {}
) => {
  const { setTxHash, txHash, setTxError, setTxSuccess } = useGuildCheckoutContext()

  const fetch = async (data?: DataType) => {
    const transaction = await sendTransaction(data)
    setTxHash(transaction.hash)
    return transaction.wait()
  }

  return useSubmit(fetch, {
    onError: (error) => {
      const prettyError =
        error?.code === "ACTION_REJECTED" ? "User rejected the transaction" : error
      if (txHash) setTxError(true)
      onError?.(prettyError)
    },
    onSuccess: (receipt) => {
      if (receipt.status !== 1) {
        setTxError(true)
        console.log("TX RECEIPT", receipt)
        return
      }
      onSuccess?.(receipt)
      setTxSuccess(true)
    },
  })
}

export default useSubmitTransaction
