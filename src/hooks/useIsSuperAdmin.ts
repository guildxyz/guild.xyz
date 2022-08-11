import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const useIsSuperAdmin = () => {
  const { account } = useWeb3React()

  const { data } = useSWRImmutable(account ? `/guild/isSuperAdmin/${account}` : null)

  return data
}

export default useIsSuperAdmin
