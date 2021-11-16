import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import useSWR from "swr"
import { User } from "temporaryData/types"

const useUser = () => {
  const { account } = useWeb3React()
  const router = useRouter()

  const { isValidating, data } = useSWR<User>(account ? `/user/${account}` : null)

  return {
    isLoading: isValidating,
    ...data,
    discordId: router.query.discordId ?? data?.discordId,
  }
}

export default useUser
