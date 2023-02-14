import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import ERC20_ABI from "static/abis/erc20Abi.json"
import useSWR, { KeyedMutator } from "swr"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

const FALLBACK = BigNumber.from(0)

const fetchBalance = async (
  _: string,
  account: string,
  chainId: number,
  web3ReactProvider?: JsonRpcProvider,
  tokenAddress?: string
) => {
  const provider =
    web3ReactProvider ?? new JsonRpcProvider(RPC[Chains[chainId]]?.rpcUrls?.[0])

  if (!tokenAddress)
    return provider
      ?.getBalance(account)
      .then((res) => res)
      .catch(() => FALLBACK)

  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider)

  return tokenContract
    ?.balanceOf(account)
    .then((res) => res)
    .catch(() => FALLBACK)
}

const useBalance = (
  tokenAddress?: string,
  chainId?: number
): {
  coinBalance: BigNumber
  mutateCoinBalance: KeyedMutator<BigNumber>
  tokenBalance: BigNumber
  mutateTokenBalance: KeyedMutator<BigNumber>
  isLoading: boolean
} => {
  const { account, provider, chainId: detectedChainId } = useWeb3React()

  const passedChainId = chainId ?? detectedChainId
  const passedProvider = chainId === detectedChainId ? provider : null

  const shouldFetchCoinBalance = account && (chainId || detectedChainId)
  const {
    data: coinBalance,
    isValidating: isCoinBalanceLoading,
    mutate: mutateCoinBalance,
  } = useSWR(
    shouldFetchCoinBalance
      ? ["coinBalance", account, passedChainId, passedProvider]
      : null,
    fetchBalance
  )

  const shouldFetchTokenBalance =
    shouldFetchCoinBalance && ADDRESS_REGEX.test(tokenAddress)

  const {
    data: tokenBalance,
    isValidating: isTokenBalanceLoading,
    mutate: mutateTokenBalance,
  } = useSWR(
    shouldFetchTokenBalance
      ? ["tokenBalance", account, passedChainId, passedProvider, tokenAddress]
      : null,
    fetchBalance
  )

  const isLoading = isCoinBalanceLoading || isTokenBalanceLoading

  return {
    coinBalance,
    mutateCoinBalance,
    tokenBalance,
    mutateTokenBalance,
    isLoading,
  }
}

export default useBalance
