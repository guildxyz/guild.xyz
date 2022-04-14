import useSWR from "swr"

const useDiscoverLinks = () =>
  useSWR<
    Array<{
      url: string
      logo?: string
      image?: string
      title: string
      description?: string
    }>
  >("/api/fetch-og-data", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    refreshInterval: 0,
    revalidateOnReconnect: false,
  })

export default useDiscoverLinks
