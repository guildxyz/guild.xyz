import { erc20Abi } from "viem"
import { useAccount, useChainId, useReadContracts } from "wagmi"

const useTokenBalance = ({
  token,
  chainId,
  shouldFetch = true,
}: {
  token: `0x${string}`
  chainId?: number
  shouldFetch?: boolean
}) => {
  const detectedChainId = useChainId()
  const { address: userAddress } = useAccount()
  const { data, ...rest } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: Boolean(token && userAddress) && shouldFetch,
    },
    // WAGMI TODO: don't know why we get this error here, had to ts-ignore it unfortunately...
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      {
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
        chainId: chainId ?? detectedChainId,
      },
      {
        address: token,
        abi: erc20Abi,
        functionName: "decimals",
        chainId: chainId ?? detectedChainId,
      },
      {
        address: token,
        abi: erc20Abi,
        functionName: "symbol",
        chainId: chainId ?? detectedChainId,
      },
    ],
  })

  const [balanceOf, decimals, symbol] = data ?? []

  return {
    data: {
      value: balanceOf,
      decimals,
      symbol,
    },
    ...rest,
  }
}

export default useTokenBalance
