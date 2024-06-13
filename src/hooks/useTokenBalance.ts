import { erc20Abi } from "viem"
import { useAccount, useReadContracts } from "wagmi"

const useTokenBalance = ({
  token,
  chainId,
  shouldFetch = true,
}: {
  token: `0x${string}`
  chainId?: number
  shouldFetch?: boolean
}) => {
  const { address: userAddress, chainId: detectedChainId } = useAccount()
  const { data, ...rest } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: Boolean(token && userAddress) && shouldFetch,
    },
    /**
     * We need to @ts-ignore this line, since we get a "Type instantiation is
     * excessively deep and possibly infinite" error here until strictNullChecks is
     * set to false in our tsconfig. We should set it to true & sort out the related
     * issues in another PR.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      {
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
