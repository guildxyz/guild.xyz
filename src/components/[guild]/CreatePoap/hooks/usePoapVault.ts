import { Contract } from "@ethersproject/contracts"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useSWR from "swr"

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
    .catch((_) => fallback)

const usePoapVault = (
  eventId: number
): {
  vaultData: { id: number; token: string; fee: number }
  isVaultLoading: boolean
} => {
  const feeCollectorContract = useFeeCollectorContract()

  const { data: vaultData, isValidating: isVaultLoading } = useSWR(
    feeCollectorContract ? ["poapVault", feeCollectorContract, eventId] : null,
    fetchPoapVault
  )

  return { vaultData, isVaultLoading }
}

export default usePoapVault
