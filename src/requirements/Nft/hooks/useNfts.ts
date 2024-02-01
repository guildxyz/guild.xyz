import { Chain } from "chains"
import useSWRImmutable from "swr/immutable"
import { NFT } from "types"

const useNfts = (chain: Chain): { nfts: Array<NFT>; isLoading: boolean } => {
  // TODO: don't retry on error
  const { isLoading, data } = useSWRImmutable(
    chain === "ETHEREUM" ? `/v2/third-party/nft/` : null,
    {
      shouldRetryOnError: false,
    }
  )

  console.log(isLoading)

  return { nfts: data, isLoading }
}

export default useNfts
