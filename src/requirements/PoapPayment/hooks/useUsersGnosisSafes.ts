import useSWRImmutable from "swr/immutable"
import { useAccount, useChainId } from "wagmi"
import GnosisApiUrls from "../gnosisAPiUrls"

const fetchUsersGnosisSafes = ([_, account, chainId]) =>
  fetch(`${GnosisApiUrls[chainId]}/owners/${account}/safes`).then(
    async (response: Response) => {
      const res = await response.json?.()
      return response.ok ? res : Promise.reject(res)
    }
  )

const useUsersGnosisSafes = (): {
  usersGnosisSafes: string[]
  isUsersGnosisSafesLoading: boolean
} => {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data, isValidating } = useSWRImmutable(
    address && chainId && GnosisApiUrls[chainId]
      ? ["usersGnosisSafes", address, chainId]
      : null,
    fetchUsersGnosisSafes
  )

  return { usersGnosisSafes: data?.safes, isUsersGnosisSafesLoading: isValidating }
}

export default useUsersGnosisSafes
