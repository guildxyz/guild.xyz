import useSWRImmutable from "swr/immutable"
import { Poap } from "temporaryData/types"

const fetchPoapsList = async () =>
  fetch("https://api.poap.xyz/events").then((data) => data.json())

const usePoapsList = (): Poap[] => {
  const { data } = useSWRImmutable("poapsList", fetchPoapsList)

  return data
}

export default usePoapsList
