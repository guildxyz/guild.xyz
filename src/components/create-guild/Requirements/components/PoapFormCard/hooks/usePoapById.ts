import useSWRImmutable from "swr/immutable"
import { Poap } from "types"

const usePoapById = (poapId: string): { poap: Poap; isPoapByIdLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable<Poap>(
    poapId ? `/assets/poap/id/${poapId}` : null
  )

  return { isPoapByIdLoading: isValidating, poap: data }
}

export default usePoapById
