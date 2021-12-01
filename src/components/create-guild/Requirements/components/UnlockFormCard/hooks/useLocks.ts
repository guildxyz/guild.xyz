import { Chains } from "connectors"
import useSWRImmutable from "swr/immutable"
import { SupportedChains } from "temporaryData/types"

const UNLOCKSUBGRAPHS = {
  1: "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock",
  100: "https://api.thegraph.com/subgraphs/name/unlock-protocol/xdai",
  56: "https://api.thegraph.com/subgraphs/name/unlock-protocol/bsc",
  137: "https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon",
}

const QUERY = `{
  locks {
    address
    name
    tokenAddress
  }
}
`

const fetchLocks = (_: string, chainId: number) =>
  fetch(UNLOCKSUBGRAPHS[chainId], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: QUERY,
    }),
  })
    .then((res) => res.json())
    .then((json) =>
      json?.data?.locks?.map((lock) => ({
        ...lock,
        icon: `https://locksmith.unlock-protocol.com/lock/${lock.address}/icon`,
      }))
    )

const useLocks = (chain: SupportedChains) => {
  const chainId = Chains[chain]

  // TODO: better typing
  const { isValidating, data } = useSWRImmutable<
    Array<{ address: string; tokenAddress: string; icon: string; name: string }>
  >(chainId ? ["locks", chainId] : null, fetchLocks)

  return { locks: data, isLoading: isValidating }
}

export default useLocks
export { UNLOCKSUBGRAPHS }
