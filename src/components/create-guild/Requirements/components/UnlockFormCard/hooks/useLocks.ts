import { Chain, Chains } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const CHAINS_ENDPOINTS = {
  1: "unlock",
  100: "xdai",
  56: "bsc",
  137: "polygon",
  10: "optimism",
  42220: "celo",
}

type Data = {
  address: string
  tokenAddress: string
  icon: string
  name: string
}

const fetch1000Locks = (endpoint: string, skip: number) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
      locks(first:1000 skip:${skip}) {
        address
        name
        tokenAddress
      }
    }
    `,
    },
  }).then((data) =>
    data?.data?.locks?.map((lock) => ({
      ...lock,
      icon: `https://locksmith.unlock-protocol.com/lock/${lock.address}/icon`,
    }))
  )

// We can only fetch 1000 locks at once, so we need to fetch them in multiple requests
const fetchLocks = async (endpoint: string) => {
  let locks = []
  let skip = 0
  let newLocks = []

  do {
    newLocks = await fetch1000Locks(endpoint, skip)
    locks = locks.concat(newLocks)
    skip += 1000
  } while (newLocks?.length > 0)

  return locks
}

const useLocks = (chain: Chain) => {
  const chainId = Chains[chain]

  const { isValidating, data } = useSWRImmutable<Data[]>(
    chainId
      ? `https://api.thegraph.com/subgraphs/name/unlock-protocol/${CHAINS_ENDPOINTS[chainId]}`
      : null,
    fetchLocks
  )

  return { locks: data?.filter((lock) => !!lock), isLoading: isValidating }
}

export default useLocks
export { CHAINS_ENDPOINTS }
