import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"

const useDiscordRoleMemberCounts = (roleIds?: string[]) => {
  const { platforms } = useGuild()
  const serverId = platforms?.[0]?.platformId

  const shouldFetch = serverId?.length > 0 && Array.isArray(roleIds)

  const { isValidating, data, error } = useSWR(
    shouldFetch
      ? [`/discord/memberCount/${serverId}`, { method: "POST", body: { roleIds } }]
      : null
  )

  return {
    memberCounts: data,
    error,
    isLoading: isValidating,
  }
}

export default useDiscordRoleMemberCounts
