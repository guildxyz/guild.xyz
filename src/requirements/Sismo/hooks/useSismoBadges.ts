import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type SismoBadgeType = "MAIN" | "PLAYGROUND"

const apiUrl: Record<SismoBadgeType, string> = {
  MAIN: "https://hub.sismo.io/badges/polygon",
  PLAYGROUND: "https://hub.playground.sismo.io/badges/polygon",
}

const fetchSismoBadges = (_: string, type: SismoBadgeType) =>
  fetcher(apiUrl[type])
    .then(
      (res) =>
        res.items?.map((badge) => ({
          label: badge.name,
          img: badge.image,
          value: badge.collectionId,
        })) ?? []
    )
    .catch(() => [])

const useSismoBadges = (type: SismoBadgeType) =>
  useSWRImmutable(type ? ["sismoBadges", type] : null, fetchSismoBadges)

export default useSismoBadges
