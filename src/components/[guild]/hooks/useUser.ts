import { useWeb3React } from "@web3-react/core"
import useKeyPair from "hooks/useKeyPair"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useUser = () => {
  const { account } = useWeb3React()
  const { keyPair, ready, isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const { isLoading, data, mutate } = useSWRImmutable<User>(
    account && ready && keyPair && isValid
      ? [`/user/${account}`, { method: "GET", body: {} }]
      : null,
    fetcherWithSign
  )

  return {
    isLoading,
    ...data,
    mutate,
  }
}

export default useUser
