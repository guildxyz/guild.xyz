import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { useEffect, useState } from "react"
import ERC20_ABI from "static/abis/erc20Abi.json"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"

const useAllowance = (): {
  isAllowanceLoading: boolean
  allowance: BigNumber
  allowanceError: any
} => {
  const { account, chainId } = useWeb3React()
  const { pickedCurrency, requirement } = useGuildCheckoutContext()

  const [isAllowanceLoading, setIsAllowanceLoading] = useState(false)
  const [allowance, setAllowance] = useState<BigNumber>()
  const [allowanceError, setAllowanceError] = useState()

  useEffect(() => {
    if (
      !pickedCurrency ||
      requirement?.chain !== Chains[chainId] ||
      pickedCurrency === RPC[requirement?.chain]?.nativeCurrency?.symbol
    )
      return
    ;(async () => {
      setAllowanceError(null)
      setIsAllowanceLoading(true)

      const provider = new JsonRpcProvider(RPC[Chains[chainId]]?.rpcUrls?.[0])
      const erc20Contract = new Contract(pickedCurrency, ERC20_ABI, provider)

      try {
        const fetchedAllowance = await erc20Contract?.allowance(
          account,
          TOKEN_BUYER_CONTRACT
        )
        setAllowance(fetchedAllowance)
      } catch (error) {
        setAllowanceError(error)
      } finally {
        setIsAllowanceLoading(false)
      }
    })()
  }, [pickedCurrency, requirement, chainId])

  return { isAllowanceLoading, allowance, allowanceError }
}

export default useAllowance
