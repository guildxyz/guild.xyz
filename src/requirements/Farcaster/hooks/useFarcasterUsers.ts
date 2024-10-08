import { useFarcasterAPI } from "@/hooks/useFarcasterAPI"
import { NEYNAR_BASE_URL } from "@/hooks/useFarcasterAPI/constants"
import type { NeynarAPIClient } from "@neynar/nodejs-sdk"
import { useSWRConfig } from "swr"

type SearchUserResponse = Awaited<ReturnType<NeynarAPIClient["searchUser"]>>

const useFarcasterUsers = (search?: string) => {
  const { mutate: globalSWRMutate } = useSWRConfig()

  const { data, mutate, ...swrResponse } = useFarcasterAPI<SearchUserResponse>(
    search ? `/user/search?viewer_fid=1&limit=10&q=${search}` : null,
    {
      onSuccess: (data) => {
        data.result.users.forEach((user) =>
          globalSWRMutate(
            `${NEYNAR_BASE_URL}/user/bulk?viewer_fid=1&fids=${user.fid}`,
            user,
            { revalidate: false }
          )
        )
      },
    }
  )

  return {
    ...swrResponse,
    data: data?.result.users,
    mutate: undefined as never,
  }
}

const useFarcasterUser = (fid?: number) => {
  const { data, mutate, ...swrResponse } = useFarcasterAPI<
    SearchUserResponse["result"]
  >(fid ? `/user/bulk?viewer_fid=1&fids=${fid}` : null)

  return {
    ...swrResponse,
    data: data?.users[0],
    mutate: undefined as never,
  }
}

export { useFarcasterUsers, useFarcasterUser }
