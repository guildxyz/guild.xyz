import { Contract } from "@ethersproject/contracts"
import useContract from "hooks/useContract"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import useSWR from "swr"

const fetchPoapVault = async (_: string, contract: Contract, eventId: number) =>
  contract
    .queryFilter?.(contract.filters.VaultRegistered?.(null, eventId))
    .then((events) => {
      const vaultId = events.find((e) => e.event === "VaultRegistered")?.args?.[0]

      if (typeof vaultId !== "undefined") return parseInt(vaultId.toString())

      return null
    })
    .catch((_) => null)

const usePoapVault = (
  eventId: number
): { vaultId: number; isVaultLoading: boolean } => {
  const feeCollectorContract = useContract(
    "0xCc1EAfB95D400c1E762f8D4C85F1382343787D7C",
    FEE_COLLECTOR_ABI,
    true
  )

  const { data: vaultId, isValidating: isVaultLoading } = useSWR(
    feeCollectorContract ? ["poapVault", feeCollectorContract, eventId] : null,
    fetchPoapVault
  )

  return { vaultId, isVaultLoading }
}

export default usePoapVault
