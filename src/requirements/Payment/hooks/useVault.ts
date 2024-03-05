import { Chain, Chains } from "chains"
import feeCollectorAbi from "static/abis/feeCollector"
import { useReadContract } from "wagmi"

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
    owner,
    token,
    multiplePayments,
    fee,
    balance,
    error,
    isLoading,
    refetch,
  }
}

export default useVault
