import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr"

const fetchENSName = (_, provider, domain) => provider.resolveName(domain)

const useReverseENSName = (domain: string) => {
  const { provider, chainId } = useWeb3React<Web3Provider>()
  const shouldFetch = Boolean(provider && domain)

  return useSWRImmutable(
    shouldFetch ? ["ENS", provider, domain, chainId] : null,
    fetchENSName
  )
}

export default useReverseENSName
