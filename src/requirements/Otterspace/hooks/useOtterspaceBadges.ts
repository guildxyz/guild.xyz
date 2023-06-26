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

const theGraphBasePath = "https://api.thegraph.com/subgraphs/name/otterspace-xyz"

const url: Partial<Record<Chain, string>> = {
  ETHEREUM: `${theGraphBasePath}/badges-mainnet`,
  POLYGON: `${theGraphBasePath}/badges-polygon`,
  OPTIMISM: `${theGraphBasePath}/badges-optimism`,
  GOERLI: `${theGraphBasePath}/badges-goerli`,
  SEPOLIA:
    "https://api.studio.thegraph.com/query/44988/badges-sepolia/version/latest",
}

const useOtterspaceBadges = (chain: Chain) =>
  useSWRImmutable<SelectOption[]>(chain ? url[chain] : null, fetchBadges)

export default useOtterspaceBadges
