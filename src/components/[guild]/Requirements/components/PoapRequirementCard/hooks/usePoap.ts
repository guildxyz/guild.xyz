import useSWRImmutable from "swr/immutable"
import { Poap } from "types"

const usePoap = (fancyId: string): { poap: Poap; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable<Poap>(
    fancyId ? `/api/poap/${fancyId}` : null
  )

  return { isLoading: isValidating, poap: data }
}

export default usePoap
