import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

const BASE_URL =
  "https://api.neynar.com/v2/farcaster/user/search?api_key=NEYNAR_API_DOCS&viewer_fid=-1&q="

const useFarcasterUsers = (search?: string): SWRResponse<SelectOption[]> => {
  const swrResponse = useSWRImmutable(search ? `${BASE_URL}${search}` : null)

  return {
    ...swrResponse,
    data:
      swrResponse.data?.result?.users?.map((user) => ({
        label: user.display_name,
        value: user.fid,
        details: user.username,
        img: user.pfp_url?.replace("w=500", "w=32"),
      })) ?? [],
  }
}

const SINGLE_USER_BASE_URL =
  "https://api.neynar.com/v1/farcaster/user/?api_key=NEYNAR_API_DOCS&viewerFid=-1&fid="

const useFarcasterUser = (fid?: number): SWRResponse<SelectOption> => {
  const swrResponse = useSWRImmutable(fid ? `${SINGLE_USER_BASE_URL}${fid}` : null)

  const user = swrResponse.data?.result?.user

  return {
    ...swrResponse,
    data: user
      ? {
          label: user.displayName,
          value: user.fid,
          details: user.username,
          img: user.pfp?.url,
        }
      : undefined,
  }
}

export default useFarcasterUsers
export { useFarcasterUser }
