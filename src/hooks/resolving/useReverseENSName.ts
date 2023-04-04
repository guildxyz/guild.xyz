import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const fetchENSName = (_, provider, domain) => provider.resolveName(domain)

const useReverseENSName = (domain: string) => {
  const { provider } = useWeb3React<Web3Provider>()
  const shouldFetch = Boolean(provider)

  const { data } = useSWRImmutable(
    shouldFetch ? ["ENS", provider, domain] : null,
    fetchENSName
  )

  return data
}

export default useReverseENSName
