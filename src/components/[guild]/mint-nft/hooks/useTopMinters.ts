import { useRouter } from "next/router"
import { TopMintersResponse } from "pages/api/nft/minters/[chain]/[address]"
import useSWRImmutable from "swr/immutable"

const useTopMinters = () => {
  const { query } = useRouter()

  const { chain, address } = query
  const shouldFetch = chain && address

  return useSWRImmutable<TopMintersResponse>(
    shouldFetch
      ? `/api/nft/minters/${chain}/${address.toString().toLowerCase()}`
      : null
  )
}

export default useTopMinters
