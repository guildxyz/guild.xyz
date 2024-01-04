import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"

const useTargetedCount = (roleIds: number[]) => {
  const { id } = useGuild()
  const { data: members, isValidating } = useSWRWithOptionalAuth<
    { roleId: number; members: `0x${string}`[] }[]
  >(roleIds?.length > 0 ? `/v2/guilds/${id}/members` : null)

  const targetedCount =
    !members || !roleIds.length
      ? 0
      : [
          ...new Set(
            members
              .filter((role) => roleIds.includes(role.roleId))
              .flatMap((role) => role.members)
          ),
        ].length

  return {
    targetedCount,
    isTargetedCountValidating: isValidating,
  }
}

export default useTargetedCount
