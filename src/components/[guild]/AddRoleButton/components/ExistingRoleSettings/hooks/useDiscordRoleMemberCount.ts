import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"

const useDiscordRoleMemberCounts = (roleIds?: string[]) => {
  const { guildPlatforms } = useGuild()
  const serverId = guildPlatforms?.[0]?.platformGuildId

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
