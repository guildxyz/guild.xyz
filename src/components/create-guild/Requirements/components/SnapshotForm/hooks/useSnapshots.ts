import useSWRImmutable from "swr/immutable"

type SnapshotStrategy = {
  name: string
  params: Record<string, Record<string, string>>
}

const fetchSnapshots = async () =>
  fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/strategies`).then((rawData) =>
    rawData.json()
  )

const useSnapshots = (): {
  strategies: Array<SnapshotStrategy>
  isLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable("snapshots", fetchSnapshots, {
    revalidateOnFocus: false,
  })

  return { strategies: data, isLoading: isValidating }
}

export default useSnapshots
