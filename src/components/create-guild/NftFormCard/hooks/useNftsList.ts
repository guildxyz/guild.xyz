import useSWR from "swr"
import { NFT } from "temporaryData/types"

const fetchNfts = async () => fetch(`/api/nfts`).then((data) => data.json())

const useNftsList = (): NFT[] => {
  const { data } = useSWR("nftsList", fetchNfts, {
    revalidateOnFocus: false,
  })

  return data
}

export default useNftsList
