import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { HUB_API } from "./config"

export default function useUserLike(userFid: number, fid: number, hash: string) {
  const { data, mutate } = useSWRImmutable(
    !!fid && !!hash && !!userFid
      ? `${HUB_API}/reactionById?fid=${userFid}&target_fid=${fid}&reaction_type=1&target_hash=${hash}`
      : null,
    async (url) => fetcher(url).then((result) => !!result?.hash),
    { shouldRetryOnError: false }
  )

  return { hasLiked: data, mutate }
}
