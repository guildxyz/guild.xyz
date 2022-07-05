import useSWRImmutable from "swr/immutable"
import { NFT, SupportedChains } from "types"

const useNfts = (
  chain: SupportedChains
): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    chain === "ETHEREUM" ? `${process.env.NEXT_PUBLIC_GUILD_API}/nft` : null
  )

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
