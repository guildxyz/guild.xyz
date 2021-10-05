import useSWRImmutable from "swr/immutable"
import { Poap } from "temporaryData/types"

const fetchPoaps = async () =>
  fetch("https://api.poap.xyz/events").then((data) => data.json())

const usePoaps = (): Poap[] => {
  const { data } = useSWRImmutable("poaps", fetchPoaps)

  return data
}

export default usePoaps
