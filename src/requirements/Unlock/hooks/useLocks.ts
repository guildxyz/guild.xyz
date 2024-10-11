import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { Chain } from "wagmiConfig/chains"

const CHAINS_ENDPOINTS = {
  ETHEREUM:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-mainnet/version/latest",
  OPTIMISM:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-optimism/version/latest",
  BSC: "https://api.studio.thegraph.com/query/65299/unlock-protocol-bsc/version/latest",
  GNOSIS:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-gnosis/version/latest",
  POLYGON:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-polygon/version/latest",
  ZKSYNC_ERA:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-zksync/version/latest",
  POLYGON_ZKEVM:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-zkevm/version/latest",
  BASE_MAINNET:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-base/version/latest",
  ARBITRUM:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-arbitrum/version/latest",
  CELO: "https://api.studio.thegraph.com/query/65299/unlock-protocol-celo/version/latest",
  AVALANCHE:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-avalanche/version/latest",
  LINEA:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-linea/version/latest",
  SCROLL:
    "https://api.studio.thegraph.com/query/65299/unlock-protocol-scroll/version/latest",
} satisfies Partial<Record<Chain, string>>

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
  const { isLoading, data } = useSWRImmutable<Data[]>(
    CHAINS_ENDPOINTS[chain],
    fetchLocks
  )

  return { locks: data?.filter((lock) => !!lock), isLoading }
}

export default useLocks
export { CHAINS_ENDPOINTS }
