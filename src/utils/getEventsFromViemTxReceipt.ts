import { Abi, TransactionReceipt, decodeEventLog } from "viem"

// TODO: we could pass generics to this util, that way we'd get back the event names / args properly. I haven't experimented with it yet, since we'll only use this util in 2 places for now.
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
          topics: (log as any).topics,
        })
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

export default getEventsFromViemTxReceipt
