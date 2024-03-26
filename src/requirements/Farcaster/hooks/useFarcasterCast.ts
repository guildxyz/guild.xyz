import useSWRImmutable from "swr/immutable"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/cast?api_key=NEYNAR_API_DOCS&identifier="

const useFarcasterCast = (hash?: string, url?: string) => {
  const isHashValid = ADDRESS_REGEX.test(hash)
  const isUrlValid = url?.startsWith("https://warpcast.com/")

  const fetchUrl = hash
    ? `${BASE_URL}${hash}&type=hash`
    : `${BASE_URL}${url}&type=url`
  const { data, isLoading, error } = useSWRImmutable(
    (hash && isHashValid) || (url && isUrlValid) ? fetchUrl : null
  )

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
