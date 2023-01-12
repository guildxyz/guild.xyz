import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

export type SismoBadgeType = keyof typeof apiUrl

const apiUrl = {
  GNOSIS: "https://hub.sismo.io/badges/gnosis",
  MAINNET: "https://hub.sismo.io/badges/mainnet",
  POLYGON: "https://hub.sismo.io/badges/polygon",
  GOERLI: "https://hub.testnets.sismo.io/badges/goerli",
  MUMBAI: "https://hub.testnets.sismo.io/badges/mumbai",
  PLAYGROUND: "https://hub.playground.sismo.io/badges/polygon",
}

const fetchSismoBadges = (_: string, type: SismoBadgeType) =>
  fetcher(apiUrl[type])
    .then(
      (res) =>
        res.items?.map((badge) => ({
          label: badge.name,
          img: badge.image,
          value: badge.collectionId.toString(),
        })) ?? []
    )
    .catch(() => [])

const useSismoBadges = (type: SismoBadgeType) =>
  useSWRImmutable(type ? ["sismoBadges", type] : null, fetchSismoBadges)

export default useSismoBadges
