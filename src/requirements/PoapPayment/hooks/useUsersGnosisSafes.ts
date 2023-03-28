import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"
import GnosisApiUrls from "../gnosisAPiUrls"

const fetchUsersGnosisSafes = (_: string, account: string, chainId: number) =>
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
  const { account, chainId } = useWeb3React()

  const { data, isValidating } = useSWRImmutable(
    account && chainId && GnosisApiUrls[chainId]
      ? ["usersGnosisSafes", account, chainId]
      : null,
    fetchUsersGnosisSafes
  )

  return { usersGnosisSafes: data?.safes, isUsersGnosisSafesLoading: isValidating }
}

export default useUsersGnosisSafes
