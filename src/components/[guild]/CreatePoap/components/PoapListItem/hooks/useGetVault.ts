import useSWR, { KeyedMutator } from "swr"
import fetcher from "utils/fetcher"

type GetVaultResponse = {
  eventId: number
  owner: string
  token: string
  fee: string
  collected: string
}

const fetchGetVault = (
  _: string,
  vaultId: number,
  chainId: number
): Promise<GetVaultResponse> =>
  fetcher(`/api/get-vault?vaultId=${vaultId}&chainId=${chainId}`)

const useGetVault = (
  vaultId: number,
  chainId: number
): {
  getVaultData: GetVaultResponse
  isGetVaultDataLoading: boolean
  mutateGetVaultData: KeyedMutator<any>
  getVaultDataError: any
} => {
  const { data, isValidating, mutate, error } = useSWR(
    typeof vaultId === "number" && typeof chainId === "number"
      ? ["getVault", vaultId, chainId]
      : null,
    fetchGetVault,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    getVaultData: data,
    isGetVaultDataLoading: isValidating,
    mutateGetVaultData: mutate,
    getVaultDataError: error,
  }
}

export default useGetVault
