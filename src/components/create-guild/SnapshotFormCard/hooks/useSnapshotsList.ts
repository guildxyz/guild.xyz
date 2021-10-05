import useSWRImmutable from "swr/immutable"
import { SnapshotStrategy } from "temporaryData/types"

const fetchSnapshots = async () =>
  fetch(`/api/strategies`).then((rawData) => rawData.json())

const useSnapshotsList = (): {
  isValidating: boolean
  strategies: Array<SnapshotStrategy>
} => {
  const { isValidating, data } = useSWRImmutable("snapshotsList", fetchSnapshots, {
    revalidateOnFocus: false,
  })

  return { isValidating, strategies: data }
}

export default useSnapshotsList
