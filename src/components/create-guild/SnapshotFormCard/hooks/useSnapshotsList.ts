import useSWR from "swr"
import { SnapshotStrategy } from "temporaryData/types"

const fetchSnapshots = async () =>
  fetch(`/api/strategies`).then((rawData) => rawData.json())

const useSnapshotsList = (): Array<SnapshotStrategy> => {
  const { data } = useSWR("snapshotsList", fetchSnapshots, {
    revalidateOnFocus: false,
  })

  return data
}

export default useSnapshotsList
