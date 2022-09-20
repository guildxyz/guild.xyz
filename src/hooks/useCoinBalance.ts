import { BigNumber } from "@ethersproject/bignumber"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useSWR from "swr"

const fetchCoinBalance = async (_: string, account: string, chainId: number) => {
  const fallbackValue = BigNumber.from(0)
  const provider = new JsonRpcProvider(RPC[Chains[chainId]]?.rpcUrls?.[0])

  return provider
    ?.getBalance(account)
    .then((res) => res)
    .catch(() => fallbackValue)
}

const useCoinBalance = (chainId?: number) => {
  const { account, chainId: detectedChainId } = useWeb3React()
  const fallbackData = BigNumber.from(0)

  const { data, isValidating } = useSWR(
    account && (chainId || detectedChainId)
      ? ["coinBalance", account, chainId ?? detectedChainId]
      : null,
    fetchCoinBalance,
    { fallbackData }
  )

  return {
    balance: data,
    isLoading: isValidating,
  }
}

export default useCoinBalance
