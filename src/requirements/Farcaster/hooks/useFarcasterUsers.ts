import { SWRResponse, useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

// partial type, contains just the fields which we're using on the frontend
type FarcasterUser = {
  fid: number
  username: string
  display_name: string
  pfp_url?: string
}

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/user/search?viewer_fid=1&limit=10&q="
const SINGLE_USER_BASE_URL =
  "https://api.neynar.com/v2/farcaster/user/bulk?viewer_fid=1&fids="

const fetchUsers = (endpoint) =>
  fetcher(endpoint, {
    headers: {
      api_key: "NEYNAR_API_DOCS",
    },
  }).then((res) => res.result?.users)
const fetchUser = (endpoint) =>
  fetcher(endpoint, {
    headers: {
      api_key: "NEYNAR_API_DOCS",
    },
  }).then((res) => res?.users?.[0])
const useFarcasterUsers = (search?: string) => {
  const { mutate } = useSWRConfig()
  return useSWRImmutable<FarcasterUser[]>(
    search ? `${BASE_URL}${search}` : null,
    fetchUsers,
    {
      onSuccess: (data, _key, _config) => {
        data.forEach((user) =>
          mutate(`${SINGLE_USER_BASE_URL}${user.fid}`, user, { revalidate: false })
        )
      },
    }
  )
}

const useFarcasterUser = (fid?: number): SWRResponse<FarcasterUser> =>
  useSWRImmutable(fid ? `${SINGLE_USER_BASE_URL}${fid}` : null, fetchUser)

export default useFarcasterUsers
export { useFarcasterUser }
