import useSWR, { KeyedMutator } from "swr"
import fetcher from "utils/fetcher"

const fetchPoapVault = async (_: string, vaultId: number, chainId: number) =>
  fetcher(`/api/get-poap-vault?vaultId=${vaultId}&chainId=${chainId}`)

const usePoapVault = (
  vaultId: number,
  chainId: number
): {
  vaultData: { id: number; token: string; fee: number }
  isVaultLoading: boolean
  mutateVaultData: KeyedMutator<any>
  vaultError: any
} => {
  const { data, isValidating, mutate, error } = useSWR(
    typeof vaultId === "number" && typeof chainId === "number"
      ? ["poapVault", vaultId, chainId]
      : null,
    fetchPoapVault,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    vaultData: data,
    isVaultLoading: !data && isValidating,
    mutateVaultData: mutate,
    vaultError: error,
  }
}

export default usePoapVault
