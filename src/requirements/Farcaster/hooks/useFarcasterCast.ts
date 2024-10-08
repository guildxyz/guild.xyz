import { useFarcasterAPI } from "@/hooks/useFarcasterAPI"
import { NEYNAR_BASE_URL } from "@/hooks/useFarcasterAPI/constants"
import type { NeynarAPIClient } from "@neynar/nodejs-sdk"
import { useSWRConfig } from "swr"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

const useFarcasterCast = (hashOrUrl: string) => {
  const isHash = ADDRESS_REGEX.test(hashOrUrl)
  const isUrl = hashOrUrl?.startsWith("https://warpcast.com/")

  const { cache } = useSWRConfig()

  const { data, isLoading, error } = useFarcasterAPI<
    Awaited<ReturnType<NeynarAPIClient["lookUpCastByHashOrWarpcastUrl"]>>
  >(
    isHash || isUrl
      ? `/cast?identifier=${hashOrUrl}&type=${isHash ? "hash" : "url"}`
      : null,
    {
      onSuccess: (data) => {
        if (!isUrl) return
        cache.set(`${NEYNAR_BASE_URL}/cast?identifier=${data.cast.hash}&type=hash`, {
          data,
        })
      },
    }
  )

  return {
    isLoading: isLoading,
    error: error,
    data: data?.cast,
  }
}

export { useFarcasterCast }
