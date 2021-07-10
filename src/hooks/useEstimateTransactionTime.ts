import { TransactionRequest } from "@ethersproject/providers"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const getEstimatedTransactionTime = async (
  _: string,
  transaction: TransactionRequest,
  library: any
): Promise<number> => {
  const gasPrice = await library.estimateGas(transaction)
  const weiGasPrice = parseUnits(gasPrice.toString(), "gwei")
  return fetch(
    `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasestimate&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}&gasprice=${weiGasPrice}`
  )
    .then((response) => response.json())
    .then((body) => +body.result * 1000)
}

const useEstimateTransactionTime = (transaction: TransactionRequest): number => {
  const { library } = useWeb3React()

  const { data } = useSWR(
    ["estimatedTransactionTime", transaction, library],
    getEstimatedTransactionTime,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )

  return data
}

export default useEstimateTransactionTime
