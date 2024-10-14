import { GetFarcasterCastResponse } from "@app/api/farcaster/types"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

const useFarcasterCast = (hashOrUrl: string) => {
  const isHash = ADDRESS_REGEX.test(hashOrUrl)
  const isUrl = hashOrUrl?.startsWith("https://warpcast.com/")

  const { cache } = useSWRConfig()

  return useSWRImmutable<GetFarcasterCastResponse>(
    isHash || isUrl
      ? `/api/farcaster/casts?identifier=${hashOrUrl}&type=${isHash ? "hash" : "url"}`
      : null,
    {
      onSuccess: (cast) => {
        if (!isUrl) return
        cache.set(`/api/farcaster/casts?identifier=${cast.hash}&type=hash`, {
          data: cast,
        })
      },
    }
  )
}

export { useFarcasterCast }
