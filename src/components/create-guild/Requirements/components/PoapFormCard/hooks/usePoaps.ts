import useSWRImmutable from "swr/immutable"
import { Poap } from "types"

const usePoaps = (): { poaps: Array<Poap>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable("https://api.poap.xyz/events")

  return { isLoading: isValidating, poaps: data }
}

export default usePoaps
