import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchNfts = async () => fetch(`/api/nfts`).then((data) => data.json())

const useNftsList = (): { isValidating: boolean; nfts: Array<NFT> } => {
  const { isValidating, data } = useSWRImmutable("nftsList", fetchNfts)

  return { isValidating, nfts: data }
}

export default useNftsList
