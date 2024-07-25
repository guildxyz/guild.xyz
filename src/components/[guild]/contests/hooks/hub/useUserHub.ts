import { Message } from "@farcaster/core"
import useSWRImmutable from "swr/immutable"
import { HUB_API } from "./config"

export default function useUserHub(fid: number) {
  // TODO: Might need pagination here
  return useSWRImmutable<{ messages: Message[]; nextPageToken: string }>(
    !!fid ? `${HUB_API}/userDataByFid?fid=${fid}` : null,
    {
      shouldRetryOnError: false,
    }
  )
}
