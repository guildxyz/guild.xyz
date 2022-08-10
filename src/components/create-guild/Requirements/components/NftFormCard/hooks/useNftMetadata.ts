import { ImageData } from "@nouns/assets"
import useSWRImmutable from "swr/immutable"
import { nounsAddresses } from "./useNftType"

const NOUNS_BACKGROUNDS = ["cool", "warm"]

const useNftMetadata = (
  address: string,
  nftSlug: string
): { metadata: Record<string, Array<string>>; isLoading: boolean } => {
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
        background: NOUNS_BACKGROUNDS,
        ...Object.fromEntries(
          Object.entries(ImageData.images).map(([key, value]) => [
            key,
            value.map(({ filename }) => filename),
          ])
        ),
      },
    }
  }

  return { isLoading: isValidating, metadata: data }
}

export { NOUNS_BACKGROUNDS }
export default useNftMetadata
