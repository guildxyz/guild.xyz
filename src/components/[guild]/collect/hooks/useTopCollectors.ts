import { TopCollectorsResponse } from "pages/api/nft/collectors/[chain]/[address]"
import useSWRImmutable from "swr/immutable"
import { useCollectNftContext } from "../components/CollectNftContext"

const useTopCollectors = () => {
  const { chain, address } = useCollectNftContext()
  const shouldFetch = chain && address

  return useSWRImmutable<TopCollectorsResponse>(
    shouldFetch
      ? `/api/nft/collectors/${chain}/${address.toString().toLowerCase()}`
      : null
  )
}

export default useTopCollectors
