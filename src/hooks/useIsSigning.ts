import useSWR from "swr"

const useIsSigning = () =>
  useSWR("isSigning", () => false, {
    fallbackData: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  }).data

export default useIsSigning
