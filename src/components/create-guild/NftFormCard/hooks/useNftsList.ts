import useSWR from "swr"
import { NFT } from "temporaryData/types"

const fetchNfts = async () =>
  fetch(`/api/metadata/all`).then((rawData) => rawData.json())

const useNftsList = (): Array<NFT> => {
  const { data } = useSWR("nftsList", fetchNfts, {
    revalidateOnFocus: false,
  })

  return data
}

export default useNftsList
