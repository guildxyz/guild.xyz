import { Contract } from "@ethersproject/contracts"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useSWR, { KeyedMutator } from "swr"

const fallback = { id: null, token: null, fee: null }

const fetchPoapVault = async (_: string, contract: Contract, eventId: number) =>
  contract
    .queryFilter?.(contract.filters.VaultRegistered?.(null, eventId))
    .then((events) => {
      const event = events.find((e) => e.event === "VaultRegistered")

      if (!event) return fallback

      const [rawId, , , token, fee] = event.args
      const id = typeof rawId !== "undefined" ? parseInt(rawId.toString()) : null

      return {
        id,
        token,
        fee,
      }
    })

const usePoapVault = (
  eventId: number
): {
  vaultData: { id: number; token: string; fee: number }
  isVaultLoading: boolean
  mutateVaultData: KeyedMutator<any>
  vaultError: any
} => {
  const feeCollectorContract = useFeeCollectorContract()

  const {
    data: vaultData,
    isValidating: isVaultLoading,
    mutate: mutateVaultData,
    error: vaultError,
  } = useSWR(
    feeCollectorContract && typeof eventId === "number"
      ? ["poapVault", feeCollectorContract, eventId]
      : null,
    fetchPoapVault,
    {
      revalidateOnFocus: false,
    }
  )

  return { vaultData, isVaultLoading, mutateVaultData, vaultError }
}

export default usePoapVault
