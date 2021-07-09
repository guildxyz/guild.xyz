import { BigNumber } from "@ethersproject/bignumber"
import { TransactionRequest } from "@ethersproject/providers"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import useSWR from "swr"

const getEstimatedTransactionTime = async (
  _: string,
  gasPrice: BigNumber
): Promise<number> =>
  fetch(
    `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasestimate&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}&gasprice=${gasPrice}`
  )
    .then((response) => response.json())
    .then((body) => +body.result * 1000)

const useEstimateTransactionTime = (transaction: TransactionRequest): number => {
  const { library } = useWeb3React()
  const [gasPrice, setGasPrice] = useState<BigNumber>()

  useEffect(() => {
    ;(async () => {
      const newGasPrice = await library.estimateGas(transaction)
      const weiGasPrice = parseUnits(newGasPrice.toString(), "gwei")
      setGasPrice(weiGasPrice)
    })()
  }, [library, transaction])

  const { data } = useSWR(
    gasPrice ? ["estimatedTransactionTime", gasPrice] : null,
    getEstimatedTransactionTime,
    { revalidateOnFocus: false }
  )

  return data
}

export default useEstimateTransactionTime
