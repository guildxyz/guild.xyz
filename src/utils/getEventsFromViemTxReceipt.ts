import { Abi, TransactionReceipt, decodeEventLog } from "viem"

// We could define a better return type for this one
const getEventsFromViemTxReceipt = (
  abi: Abi,
  receipt: TransactionReceipt
): any[] => {
  if (!receipt) return []

  return receipt.logs
    .map((log) => {
      try {
        return decodeEventLog({
          abi,
          data: log.data,
          // I think there's a missing property on the TransactionReceipt type
          topics: (log as any).topics,
        })
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

export default getEventsFromViemTxReceipt
