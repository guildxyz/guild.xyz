import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const INACCURACY_INTERVAL_MS = 15 * 60 * 1000

const useTimeInaccuracy = () => {
  /**
   * Temporarily disable to see how much serverless function execution time can we
   * save by not calling /api/timestamp for every session
   */
  return 0

  const { data } = useSWRImmutable<number>("/api/timestamp", (url) =>
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
