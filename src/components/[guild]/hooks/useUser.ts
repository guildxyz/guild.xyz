import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { User } from "temporaryData/types"

const fetchUser = (_: string, userAddress: string): Promise<User> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/user/${userAddress}`).then((response) =>
    response.ok ? response.json() : null
  )

const useUser = (): {
  isLoading: boolean
  user: User
} => {
  const { active, account } = useWeb3React()

  const { isValidating, data } = useSWR<User>(
    active ? ["user", account] : null,
    fetchUser
  )

  return {
    isLoading: isValidating,
    user: data || null,
  }
}

export default useUser
