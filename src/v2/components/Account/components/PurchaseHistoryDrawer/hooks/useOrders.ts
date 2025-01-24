import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { useCallback, useEffect } from "react"
import useSWRInfinite from "swr/infinite"
import { operations as billingOperations, components } from "types/billingTypes"

const LIMIT = 10
type OrdersResponse =
  billingOperations["getOrders"]["responses"]["200"]["content"]["application/json"]
export type Order = components["schemas"]["Order"]

const useOrders = (shouldFetch: boolean) => {
  const { id } = useUser()

  const fetcherWithSign = useFetcherWithSign()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const getKey = useCallback(
    (pageIndex: number, previousPageData: OrdersResponse | null) => {
      if (!id || !shouldFetch) return null

      // If there's no previous page data, this is the first page
      if (!previousPageData) {
        return getKeyForSWRWithOptionalAuth(
          `/v2/users/${id}/orders?page=1&limit=${LIMIT}`
        )
      }

      // If we've reached the end, return null
      if (pageIndex + 1 > previousPageData.pagination.pages) return null

      // Otherwise, return the next page key
      return getKeyForSWRWithOptionalAuth(
        `/v2/users/${id}/orders?page=${pageIndex + 1}&limit=${LIMIT}`
      )
    },
    [id, getKeyForSWRWithOptionalAuth, shouldFetch]
  )

  useEffect(() => {
    if (!shouldFetch) return
    mutate()
  }, [shouldFetch])

  const { data, size, setSize, error, mutate, isValidating } =
    useSWRInfinite<OrdersResponse>(getKey, fetcherWithSign, {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      keepPreviousData: true,
      shouldRetryOnError: false,
      revalidateOnMount: false,
    })

  const orders = data?.map((page) => page.orders).flat() ?? []

  const isEmpty = data?.[0]?.orders?.length === 0
  const isReachingEnd =
    isEmpty ||
    (data &&
      data[data.length - 1]?.pagination.page >=
        data[data.length - 1]?.pagination.pages)

  return {
    orders,
    isValidating,
    isReachingEnd,
    error,
    loadMore: () => setSize(size + 1),
    mutate,
  }
}

export { useOrders }
