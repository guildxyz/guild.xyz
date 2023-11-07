import { TopCollectorsResponse } from "pages/api/nft/collectors/[chain]/[address]"
import useSWRImmutable from "swr/immutable"
import { useCollectNftContext } from "../components/CollectNftContext"

const useTopCollectors = () => {
  const { chain, nftAddress } = useCollectNftContext()
  const shouldFetch = chain && nftAddress

  return useSWRImmutable<TopCollectorsResponse>(
    shouldFetch ? `/api/nft/collectors/${chain}/${nftAddress.toLowerCase()}` : null
  )
}

export default useTopCollectors
