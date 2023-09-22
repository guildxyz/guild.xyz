import { ImageData } from "@nouns/assets"
import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import { nounsAddresses } from "./useNftType"

export type NftMetadata = {
  image?: string
  name?: string
  slug?: string
  traits?: Record<string, Array<string>>
}

const baseUrl = `/v2/third-party`

const NOUNS_BACKGROUNDS = ["cool", "warm"]

const useNftMetadata = (
  chain: Chain,
  address: string,
  tokenId: string
): { isLoading: boolean; metadata: Omit<NftMetadata, "traits" | "slug"> } => {
  const shouldFetch = chain && address && tokenId
  const { isLoading, data } = useSWRImmutable(
    shouldFetch ? `${baseUrl}/nft/${chain}/${address}/${tokenId}` : null,
    {
      shouldRetryOnError: false,
    }
  )

  return { isLoading, metadata: data }
}

// Works for Ethereum Mainnet NFTs for now
const useNftMetadataWithTraits = (
  chain: Chain,
  address: string,
  slug?: string
): { isLoading: boolean; metadata: NftMetadata } => {
  const isNounsContract =
    chain === "ETHEREUM" &&
    Object.values(nounsAddresses).includes(address?.toLowerCase())
  const shouldFetch = address && !isNounsContract

  const { data, isLoading } = useSWRImmutable(
    chain === "ETHEREUM" && shouldFetch
      ? `${baseUrl}/nft/${slug ? slug : `address/${address}`}`
      : null
  )

  if (isNounsContract) {
    return {
      isLoading: false,
      metadata: {
        name: "Nouns",
        image: "https://storage.googleapis.com/nftimagebucket/tokensinfo/14704.png",
        slug: null,
        traits: {
          background: NOUNS_BACKGROUNDS,
          body: ImageData.images.bodies.map(({ filename }) => filename),
          accessory: ImageData.images.accessories.map(({ filename }) => filename),
          head: ImageData.images.heads.map(({ filename }) => filename),
          glasses: ImageData.images.glasses.map(({ filename }) => filename),
        },
      },
    }
  }

  return { isLoading, metadata: data }
}

export default useNftMetadata
export { NOUNS_BACKGROUNDS, useNftMetadataWithTraits }
