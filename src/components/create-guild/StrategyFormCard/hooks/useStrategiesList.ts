import useSWR from "swr"

const fetchStrategies = async () =>
  fetch(`/api/strategies`).then((rawData) => rawData.json())

const useStrategiesList = (): Array<string> => {
  const { data } = useSWR("strategiesList", fetchStrategies, {
    revalidateOnFocus: false,
  })

  return data
}

export default useStrategiesList
