import useSWRImmutable from "swr/immutable"
import { NFT } from "types"

const useNfts = (
  prefix: string,
  minLength = 1
): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    `${process.env.NEXT_PUBLIC_GUILD_API}/nft${
      prefix.length >= minLength ? `/prefix/${prefix.replace(" ", "-")}` : ""
    }`
  )

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
