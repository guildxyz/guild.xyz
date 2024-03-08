import useSWRImmutable from "swr/immutable"

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/cast?api_key=NEYNAR_API_DOCS&identifier="

const useFarcasterCast = (hash?: string, url?: string) => {
  const fetchUrl = hash
    ? `${BASE_URL}${hash}&type=hash`
    : `${BASE_URL}${url}&type=url`
  const { data, isLoading, error } = useSWRImmutable(hash || url ? fetchUrl : null)

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
