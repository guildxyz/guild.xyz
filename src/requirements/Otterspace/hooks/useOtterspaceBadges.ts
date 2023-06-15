import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import fetcher from "utils/fetcher"

const fetch1000Badges = (endpoint: string, skip: number) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        badgeSpecs(first:1000 skip:${skip}) {
          id
          metadata {
            name
            image
          }
        }
      }`,
    },
  }).then((res) =>
    res?.data?.badgeSpecs
      ?.filter((badge) => !!badge.metadata?.name)
      ?.map((badge) => ({
        value: badge.id,
        label: badge.metadata.name,
        img: badge.metadata.image.replace("ipfs://", "https://ipfs.fleek.co/ipfs/"),
      }))
  )

// We can only fetch 1000 badges at once, so we need to fetch them in multiple requests
const fetchBadges = async (endpoint: string) => {
  let badges = []
  let skip = 0
  let newBadges = []

  do {
    newBadges = await fetch1000Badges(endpoint, skip)
    badges = badges.concat(newBadges ?? [])
    skip += 1000
  } while (newBadges?.length > 0)

  return badges
}


const basePath = "https://api.thegraph.com/subgraphs/name/otterspace-xyz/";
const sepoliaSubgraphUrl = 'https://api.studio.thegraph.com/query/44988/badges-sepolia/version/latest';

const path: Partial<Record<Chain, string>> = {
  ETHEREUM: "badges-mainnet",
  POLYGON: "badges-polygon",
  OPTIMISM: "badges-optimism",
  GOERLI: "badges-goerli",
  SEPOLIA: sepoliaSubgraphUrl,
};

const getChainUrl = (chain: Chain): string => {
  if (chain === 'SEPOLIA') {
    return path[chain] ?? '';
  } else {
    return `${basePath}${path[chain] ?? `badges-${chain.toLowerCase()}`}`;
  }
}

const useOtterspaceBadges = (chain: Chain) =>
  useSWRImmutable<SelectOption[]>(
    chain ? getChainUrl(chain) : null,
    fetchBadges
  );


export default useOtterspaceBadges
