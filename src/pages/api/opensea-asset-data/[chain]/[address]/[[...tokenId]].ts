import { Chain } from "connectors"
import fetcher from "utils/fetcher"

const OPENSEA_API_OPTIONS = {
  headers: {
    "X-API-KEY": process.env.OPENSEA_API_KEY,
  },
}

export const openseaChains: Partial<Record<Chain, string>> = {
  ETHEREUM: "ethereum",
  POLYGON: "matic",
}

export default async function handler(req, res) {
  const { chain, address, tokenId } = req.query
  if (!address) return res.status(404).json(null)

  const data = {
    image: undefined,
    name: undefined,
    slug: undefined,
    isOpensea: true,
  }

  if (!openseaChains[chain]) return res.json(null)

  if (chain === "ETHEREUM" && !tokenId) {
    await fetcher(
      `https://api.opensea.io/api/v1/asset_contract/${address}`,
      OPENSEA_API_OPTIONS
    )
      .then((openseaData) => {
        if (!openseaData.collection) return
        data.image = openseaData.image_url
        data.slug = openseaData.collection?.slug
      })
      .catch((_) => {})
  } else {
    await fetcher(
      `https://api.opensea.io/api/v2/metadata/${openseaChains[chain]}/${address}/${tokenId}`,
      OPENSEA_API_OPTIONS
    )
      .then((metadata) => {
        if (!metadata.name) return
        data.image = metadata.image
        data.name = metadata.name
        data.isOpensea = !metadata.external_link
      })
      .catch((_) => {})
  }

  res.json(data)
}
