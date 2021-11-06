import useSWRImmutable from "swr/immutable"
import { Poap } from "temporaryData/types"

const fetchPoaps = async () =>
  fetch("https://api.poap.xyz/events").then((data) => data.json())

const usePoaps = (): { poaps: Array<Poap>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable("poaps", fetchPoaps)

  return { isLoading: isValidating, poaps: data }
}

export default usePoaps
