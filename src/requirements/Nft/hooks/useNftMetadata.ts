import { ImageData } from "@nouns/assets"
import useSWRImmutable from "swr/immutable"
import { nounsAddresses } from "./useNftType"

type NftMetadata = {
  image?: string
  name?: string
  slug?: string
  traits?: Record<string, Array<string>>
}

const NOUNS_BACKGROUNDS = ["cool", "warm"]

const useNftMetadata = (
  address: string,
  nftSlug?: string
): { metadata: NftMetadata; isLoading: boolean } => {
  const isNounsContract = Object.values(nounsAddresses).includes(
    address?.toLowerCase()
  )

  const { isValidating, data } = useSWRImmutable(
    address && !isNounsContract
      ? `${process.env.NEXT_PUBLIC_GUILD_API}/nft/${
          nftSlug ? nftSlug : `address/${address}`
        }`
      : null,
    {
      shouldRetryOnError: false,
    }
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

  return { isLoading: isValidating, metadata: data }
}

export { NOUNS_BACKGROUNDS }
export default useNftMetadata
