import useSWRImmutable from "swr/immutable"
import { NFT } from "types"

const useNfts = (): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    `${process.env.NEXT_PUBLIC_GUILD_API}/nft`
  )

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
