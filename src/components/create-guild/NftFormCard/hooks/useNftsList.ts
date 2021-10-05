import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchNfts = async () => fetch(`/api/nfts`).then((data) => data.json())

const useNftsList = (): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable("nftsList", fetchNfts)

  return { nfts: data, isLoading: isValidating }
}

export default useNftsList
