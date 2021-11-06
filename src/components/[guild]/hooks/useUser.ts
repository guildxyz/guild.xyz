import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { User } from "temporaryData/types"

const useUser = (): {
  isLoading: boolean
  user: User
} => {
  const { account } = useWeb3React()

  const { isValidating, data } = useSWR<User>(account ? `/user/${account}` : null)

  return {
    isLoading: isValidating,
    user: data,
  }
}

export default useUser
