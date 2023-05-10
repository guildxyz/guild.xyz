import { useEffect } from "react"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import useLocalStorage from "./useLocalStorage"

const INACCURACY_INTERVAL_MS = 15 * 60 * 1000

const useTimeInaccuracy = () => {
  const [shouldFetch, setShouldFetch] = useLocalStorage(
    "shouldFetchTimestamp",
    false
  )

  useEffect(() => {
    const listener = () => {
      setShouldFetch(true)
      location?.reload()
    }

    window.addEventListener("INVALID_TIMESTAMP", listener)
    return () => window.removeEventListener("INVALID_TIMESTAMP", listener)
  }, [setShouldFetch])

  const { data } = useSWRImmutable<number>(
    shouldFetch ? "/api/timestamp" : null,
    (url) =>
      fetcher(url).then((ts) => {
        const numTs = +ts

        const clientTime = Date.now()
        if (
          clientTime < numTs - INACCURACY_INTERVAL_MS ||
          clientTime > numTs + INACCURACY_INTERVAL_MS
        ) {
          return numTs - clientTime
        }
        return 0
      })
  )

  return data || 0
}

export default useTimeInaccuracy
