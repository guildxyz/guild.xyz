import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { useFetcherWithSign } from "utils/fetcher"

export default function useFarcasterAction(
  roleId: number,
  action: "follow" | "like" | "recast",
  options?: UseSubmitOptions<boolean>
) {
  const { farcasterProfiles, id } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  return useSubmit(async (param?: string) => {
    if (!param) {
      throw new Error("Unknown Farcaster action")
    }
    if (!farcasterProfiles?.[0]?.fid) {
      throw new Error("First connect ypur Farcaster account")
    }

    await fetcherWithSign([
      `/v2/users/${id}/farcaster-profiles/${
        farcasterProfiles[0].fid
      }/${action}/${encodeURIComponent(param)}`,
      { method: "POST" },
    ])

    triggerMembershipUpdate({ roleIds: [roleId] })

    return true
  }, options)
}
