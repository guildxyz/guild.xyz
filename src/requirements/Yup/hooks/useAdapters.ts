import useSWRImmutable from "swr/immutable"

const useAdapters = (): { adapters: string[]; isAdatpersLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable("https://api.yup.io/score/weights")

  const adapters = Object.keys(data?.data ?? {})

  return {
    adapters,
    isAdatpersLoading: isValidating,
  }
}

export default useAdapters
