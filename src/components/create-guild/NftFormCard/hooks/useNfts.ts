import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchNfts = async () => fetch(`/api/nfts`).then((data) => data.json())

const useNfts = (): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable("nfts", fetchNfts)

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
