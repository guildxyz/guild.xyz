import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import { NFT } from "types"

const useNfts = (chain: Chain): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    chain === "ETHEREUM" ? `${process.env.NEXT_PUBLIC_GUILD_API}/nft` : null
  )

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
