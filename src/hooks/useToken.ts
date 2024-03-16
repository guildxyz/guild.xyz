import { erc20Abi } from "viem"
import { useReadContracts } from "wagmi"

const useToken = ({
  address,
  chainId,
  shouldFetch = true,
}: {
  address: `0x${string}`
  chainId: number
  shouldFetch?: boolean
}) => {
  const { data, ...rest } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: !!address && !!chainId && !!shouldFetch,
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
        address,
        abi: erc20Abi,
        functionName: "decimals",
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: "name",
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
        chainId,
      },
      {
        address,
        abi: erc20Abi,
        functionName: "totalSupply",
        chainId,
      },
    ],
  })

  const [decimals, name, symbol, totalSupply] = data ?? []

  return {
    data: {
      decimals,
      name,
      symbol,
      totalSupply,
    },
    ...rest,
  }
}

export default useToken
