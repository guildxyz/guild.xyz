import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchNfts = async () => fetch(`/api/nfts`).then((data) => data.json())

const useNftsList = (): Array<NFT> => {
  const { data } = useSWRImmutable("nftsList", fetchNfts)

  return data
}

export default useNftsList
