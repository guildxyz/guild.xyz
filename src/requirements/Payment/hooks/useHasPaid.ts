import feeCollectorAbi from "static/abis/feeCollector"
import { useAccount, useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const useHasPaid = (
  contractAddress: `0x${string}`,
  vaultId: number,
  chain?: Chain
) => {
  const { address } = useAccount()
  const enabled = Boolean(contractAddress && address && vaultId)

  return useReadContract({
    abi: feeCollectorAbi,
    address: contractAddress,
    functionName: "hasPaid",
    args: [BigInt(vaultId ?? 0), address],
    chainId: Chains[chain],
    query: {
      enabled,
    },
  })
}

export default useHasPaid
