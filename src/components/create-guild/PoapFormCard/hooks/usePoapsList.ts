import useSWR from "swr"
import { Poap } from "temporaryData/types"

const fetchPoapsList = async () =>
  fetch("https://api.poap.xyz/events").then((data) => data.json())

const usePoapsList = (): Poap[] => {
  const { data } = useSWR("tokensList", fetchPoapsList, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
  })

  return data
}

export default usePoapsList
