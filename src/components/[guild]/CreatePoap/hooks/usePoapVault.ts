import { FEE_COLLECTOR_ADDRESS } from "hooks/useFeeCollectorContract"
import legacyPoapFeeCollectorAbi from "static/abis/legacyPoapFeeCollector"
import { useContractRead } from "wagmi"

const usePoapVault = (vaultId: number, chainId: number) => {
  const {
    data,
    error: vaultError,
    isLoading: isVaultLoading,
    refetch: refetchVaultData,
  } = useContractRead({
    abi: legacyPoapFeeCollectorAbi,
    address: FEE_COLLECTOR_ADDRESS,
    chainId,
    functionName: "getVault",
    args: [BigInt(vaultId ?? 0)],

    enabled: Boolean(typeof vaultId === "number" && chainId),
  })

  const [eventId, owner, token, fee, collected] = data ?? []

  return {
    vaultData: { eventId, owner, token, fee, collected },
    isVaultLoading,
    refetchVaultData,
    vaultError,
  }
}

export default usePoapVault
