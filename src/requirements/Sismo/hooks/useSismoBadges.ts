import { Chain } from "chains"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

export type SismoBadgeChain = Extract<Chain, "GNOSIS" | "POLYGON" | "GOERLI">

const playgroundApiUrl = "https://hub.playground.sismo.io/badges/polygon"
const apiUrl: Record<SismoBadgeChain, string> = {
  GNOSIS: "https://hub.sismo.io/badges/gnosis",
  POLYGON: "https://hub.sismo.io/badges/polygon",
  GOERLI: "https://hub.testnets.sismo.io/badges/goerli",
}

const fetchSismoBadges = ([_, chain, isPlayGround]) =>
  fetcher(isPlayGround ? playgroundApiUrl : apiUrl[chain])
    .then(
      (res) =>
        res.items?.map((badge) => ({
          label: badge.name,
          img: badge.image,
          value: badge.collectionId.toString(),
        })) ?? []
    )
    .catch(() => [])

const useSismoBadges = (chain: Chain, isPlayGround?: boolean) =>
  useSWRImmutable(
    chain ? ["sismoBadges", chain, isPlayGround] : null,
    fetchSismoBadges
  )

export default useSismoBadges
