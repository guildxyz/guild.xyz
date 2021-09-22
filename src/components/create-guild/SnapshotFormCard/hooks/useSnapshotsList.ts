import useSWR from "swr"

const fetchSnapshots = async () =>
  fetch(`/api/strategies`).then((rawData) => rawData.json())

const useSnapshotsList = (): Array<string> => {
  const { data } = useSWR("snapshotsList", fetchSnapshots, {
    revalidateOnFocus: false,
  })

  return data
}

export default useSnapshotsList
