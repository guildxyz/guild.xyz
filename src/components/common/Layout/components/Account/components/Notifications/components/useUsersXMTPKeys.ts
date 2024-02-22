import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useState } from "react"
import { useFetcherWithSign } from "utils/fetcher"

export const useUsersXMTPKeys = () => {
  const fetcherWithSign = useFetcherWithSign()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id, error: userError, isLoading: isUserLoading } = useUser()

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      fetcherWithSign([
        id ? `/v2/users/${id}/keys` : null,
        {
          method: "GET",
          body: {
            Accept: "application/json",
            query: { service: "XMTP" },
          },
        },
      ])
        .then((response) => {
          setData(response)
        })
        .catch(setError)
        .finally(() => {
          setIsLoading(true)
        })
    }
  }, [id])

  return {
    keys: data?.keys,
    isLoading: isUserLoading || isLoading,
    error: userError && error,
  }
}
