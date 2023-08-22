import useSWR, { KeyedMutator } from "swr"
import fetcher from "utils/fetcher"

type GetVaultResponse = {
  eventId: number
  owner: string
  token: string
  fee: string
  collected: string
}

const fetchPoapVault = async ([_, vaultId, chainId]): Promise<GetVaultResponse> =>
  fetcher(`/api/poap/get-poap-vault/${vaultId}/${chainId}`)

const usePoapVault = (
  vaultId: number,
  chainId: number
): {
  vaultData: GetVaultResponse
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
