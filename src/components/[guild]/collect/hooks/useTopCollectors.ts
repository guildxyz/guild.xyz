import { useRouter } from "next/router"
import { TopCollectorsResponse } from "pages/api/nft/collectors/[chain]/[address]"
import useSWRImmutable from "swr/immutable"

const useTopCollectors = () => {
  const { query } = useRouter()

  const { chain, address } = query
  const shouldFetch = chain && address

  return useSWRImmutable<TopCollectorsResponse>(
    shouldFetch
      ? `/api/nft/collectors/${chain}/${address.toString().toLowerCase()}`
      : null
  )
}

export default useTopCollectors
