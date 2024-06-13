import feeCollectorAbi from "static/abis/feeCollector"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

type GetVaultResponse = {
  owner: `0x${string}`
  token: `0x${string}`
  multiplePayments: boolean
  fee: bigint
  balance: bigint
  error: Error
  isLoading: boolean
  refetch: () => void
}

const useVault = (
  contractAddress: `0x${string}`,
  vaultId: number | string,
  chain: Chain
): GetVaultResponse => {
  const { data, error, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: feeCollectorAbi,
    chainId: Chains[chain],
    functionName: "getVault",
    args: [BigInt(vaultId ?? 0)],
    query: {
      enabled: Boolean(contractAddress && vaultId && chain),
    },
  })

  const [owner, token, multiplePayments, fee, balance] = data ?? []

  return {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    owner,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    token,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    multiplePayments,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    fee,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    balance,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    error,
    isLoading,
    refetch,
  }
}

export default useVault
