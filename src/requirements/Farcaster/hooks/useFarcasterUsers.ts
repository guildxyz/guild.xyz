import {
  GetFarcasterUserByFIDResponse,
  SearchFarcasterUsersResponse,
} from "@app/api/farcaster/types"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"

const useFarcasterUsers = (search?: string) => {
  const { mutate: globalSWRMutate } = useSWRConfig()

  return useSWRImmutable<SearchFarcasterUsersResponse>(
    search ? `/api/farcaster/users/search?q=${search}` : null,
    {
      onSuccess: (data) => {
        data.forEach((user) =>
          globalSWRMutate(`/api/farcaster/users/${user.fid}`, user, {
            revalidate: false,
          })
        )
      },
    }
  )
}

const useFarcasterUser = (fid?: number) =>
  useSWRImmutable<GetFarcasterUserByFIDResponse>(
    fid ? `/api/farcaster/users/${fid}` : null
  )

export { useFarcasterUsers, useFarcasterUser }
