import useSWRImmutable from "swr/immutable"
import { SnapshotStrategy } from "temporaryData/types"

const fetchSnapshots = async () =>
  fetch(`/api/strategies`).then((rawData) => rawData.json())

const useSnapshotsList = (): {
  strategies: Array<SnapshotStrategy>
  isLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable("snapshotsList", fetchSnapshots, {
    revalidateOnFocus: false,
  })

  return { strategies: data, isLoading: isValidating }
}

export default useSnapshotsList
