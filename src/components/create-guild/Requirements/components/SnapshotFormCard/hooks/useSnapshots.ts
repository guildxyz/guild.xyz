import useSWRImmutable from "swr/immutable"
import { SnapshotStrategy } from "types"

const useSnapshots = (): {
  strategies: Array<SnapshotStrategy>
  isLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable("/api/strategies")

  return { strategies: data, isLoading: isValidating }
}

export default useSnapshots
