import { Chain, Chains } from "chains"
import feeCollectorAbi from "static/abis/feeCollector"
import { useAccount, useContractRead } from "wagmi"

const useHasPaid = (
  contractAddress: `0x${string}`,
  vaultId: number,
  chain?: Chain
) => {
  const { address } = useAccount()
  const enabled = Boolean(contractAddress && address && vaultId)

  return useContractRead({
    abi: feeCollectorAbi,
    address: contractAddress,
    functionName: "hasPaid",
    args: [BigInt(vaultId ?? 0), address],
    chainId: Chains[chain],
    enabled,
  })
}

export default useHasPaid
