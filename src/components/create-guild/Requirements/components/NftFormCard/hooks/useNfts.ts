import useSWRImmutable from "swr/immutable"
import { NFT } from "types"

const useNfts = (
  prefix: string,
  minLength?: number
): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    `${process.env.NEXT_PUBLIC_GUILD_API}/nft${
      typeof minLength === "number" && prefix.length >= minLength
        ? `/prefix/${prefix}`
        : ""
    }`
  )

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
