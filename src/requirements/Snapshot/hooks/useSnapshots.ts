import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type SnapshotStrategy = {
  key: string
  schema?: {
    definitions: {
      Strategy: {
        title: string
        properties: Record<string, any>
        required: string[]
      }
    }
  }
}

const fetchSnapshots = async () =>
  fetcher("https://score.snapshot.org/api/strategies").catch(() => {})

const useSnapshots = (): {
  strategies: Record<string, SnapshotStrategy>
  isLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable("snapshots", fetchSnapshots)

  return { strategies: data, isLoading: isValidating }
}

export default useSnapshots
