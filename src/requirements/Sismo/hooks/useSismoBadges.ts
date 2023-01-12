import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

export type SismoBadgeChain = Extract<Chain, "GNOSIS" | "POLYGON" | "GOERLI">

const apiUrl: Record<SismoBadgeChain, string> = {
  GNOSIS: "https://hub.sismo.io/badges/gnosis",
  POLYGON: "https://hub.sismo.io/badges/polygon",
  GOERLI: "https://hub.testnets.sismo.io/badges/goerli",
}

const fetchSismoBadges = (_: string, chain: SismoBadgeChain) =>
  fetcher(apiUrl[chain])
    .then(
      (res) =>
        res.items?.map((badge) => ({
          label: badge.name,
          img: badge.image,
          value: badge.collectionId.toString(),
        })) ?? []
    )
    .catch(() => [])

const useSismoBadges = (chain: Chain) =>
  useSWRImmutable(chain ? ["sismoBadges", chain] : null, fetchSismoBadges)

export default useSismoBadges
