import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { User } from "temporaryData/types"

const useUser = () => {
  const { account } = useWeb3React()

  const { isValidating, data } = useSWR<User>(account ? `/user/${account}` : null)

  return {
    isLoading: isValidating,
    ...data,
  }
}

export default useUser
