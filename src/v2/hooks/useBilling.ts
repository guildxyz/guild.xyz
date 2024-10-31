import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import useSWRInfinite from "swr/infinite"
import { useAccount } from "wagmi"

export const useBilling = () => {
  const { address } = useAccount()
  const limit = 10

  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (
      !address ||
      (previousPageData?.pagination &&
        previousPageData.pagination.currentPage ===
          previousPageData.pagination.totalPages)
    )
      return null
    const url = `/v2/users/${address}/purchase-history?page=${pageIndex + 1}&limit=${limit}`
    return getKeyForSWRWithOptionalAuth(url)
  }

  const fetcherWithSign = useFetcherWithSign()

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(getKey, fetcherWithSign)

  const receipts = data?.flatMap((page) => page.receipts) || []
  const pagination = data?.[data?.length - 1].pagination || {}

  const loadMore = () => {
    setSize(size + 1)
  }

  return { receipts, pagination, error, isLoading, isValidating, loadMore, mutate }
}
