import { Chains } from "connectors"
import useSWRImmutable from "swr/immutable"
import { SupportedChains } from "temporaryData/types"
import fetcher from "utils/fetcher"

const CHAINS_ENDPOINTS = {
  1: "unlock",
  100: "xdai",
  56: "bsc",
  137: "polygon",
}

const QUERY = `{
  locks {
    address
    name
    tokenAddress
  }
}
`
type Data = {
  address: string
  tokenAddress: string
  icon: string
  name: string
}

const fetchLocks = (endpoint) =>
  fetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
  }).then((data) =>
    data?.data?.locks?.map((lock) => ({
      ...lock,
      icon: `https://locksmith.unlock-protocol.com/lock/${lock.address}/icon`,
    }))
  )

const useLocks = (chain: SupportedChains) => {
  const chainId = Chains[chain]

  const { isValidating, data } = useSWRImmutable<Data[]>(
    chainId
      ? `https://api.thegraph.com/subgraphs/name/unlock-protocol/${CHAINS_ENDPOINTS[chainId]}`
      : null,
    fetchLocks
  )

  return { locks: data, isLoading: isValidating }
}

export default useLocks
export { CHAINS_ENDPOINTS }
