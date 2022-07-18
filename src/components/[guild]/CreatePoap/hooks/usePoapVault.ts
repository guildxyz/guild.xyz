import useSWR, { KeyedMutator } from "swr"
import fetcher from "utils/fetcher"

const fetchPoapVault = async (_: string, eventId: number, chainId: number) =>
  fetcher(`/api/get-poap-vault?eventId=${eventId}&chainId=${chainId}`)

const usePoapVault = (
  eventId: number,
  chainId: number
): {
  vaultData: { id: number; token: string; fee: number }
  isVaultLoading: boolean
  mutateVaultData: KeyedMutator<any>
  vaultError: any
} => {
  const {
    data: vaultData,
    isValidating: isVaultLoading,
    mutate: mutateVaultData,
    error: vaultError,
  } = useSWR(
    typeof eventId === "number" && typeof chainId === "number"
      ? ["poapVault", eventId, chainId]
      : null,
    fetchPoapVault,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return { vaultData, isVaultLoading, mutateVaultData, vaultError }
}

export default usePoapVault
