import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import ERC20_ABI from "static/abis/erc20Abi.json"
import useSWR from "swr"

const fetchTokenBalance = async (
  _: string,
  account: string,
  tokenAddress: string,
  chainId: number
) => {
  const fallbackValue = BigNumber.from(0)
  const provider = new JsonRpcProvider(RPC[Chains[chainId]]?.rpcUrls?.[0])
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider)

  return tokenContract
    ?.balanceOf(account)
    .then((res) => res)
    .catch(() => fallbackValue)
}

const useTokenBalance = (
  tokenAddress: string,
  chainId: number
): { balance: BigNumber; isLoading: boolean } => {
  const { account } = useWeb3React()
  const fallbackData = BigNumber.from(0)

  const { data, isValidating } = useSWR(
    account && tokenAddress && chainId
      ? ["tokenBalance", account, tokenAddress, chainId]
      : null,
    fetchTokenBalance,
    { fallbackData }
  )

  return {
    balance: data,
    isLoading: isValidating,
  }
}

export default useTokenBalance
