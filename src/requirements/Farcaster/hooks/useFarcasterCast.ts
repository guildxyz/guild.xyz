import { useEffect } from "react"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/cast?api_key=NEYNAR_API_DOCS&identifier="

const useFarcasterCast = (hashOrUrl: string) => {
  const isHash = ADDRESS_REGEX.test(hashOrUrl)
  const isUrl = hashOrUrl?.startsWith("https://warpcast.com/")

  const fetchUrl = `${BASE_URL}${hashOrUrl}&type=${isHash ? "hash" : "url"}`
  const { data, isLoading, error } = useSWRImmutable(
    isHash || isUrl ? fetchUrl : null
  )

  const { cache } = useSWRConfig()

  // If we fetched data by url, we populate the hash cache too
  useEffect(() => {
    if (!isUrl || !data?.cast?.hash) return
    cache.set(`${BASE_URL}${data.cast.hash}&type=hash`, {
      data,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashOrUrl, isUrl, data?.cast?.hash])

  return {
    isLoading: isLoading,
    error: error,
    data: data
      ? {
          hash: data?.cast?.hash,
          username: data?.cast?.author?.username,
          display_name: data?.cast?.author?.display_name,
          profile_pic: data?.cast?.author?.pfp_url,
          text: data?.cast?.text,
          timestamp: data?.cast?.timestamp,
          likes: data?.cast?.reactions?.likes?.length,
          recasts: data?.cast?.reactions?.recasts?.length,
          replies: data?.cast?.replies?.count,
        }
      : null,
  }
}

export default useFarcasterCast
