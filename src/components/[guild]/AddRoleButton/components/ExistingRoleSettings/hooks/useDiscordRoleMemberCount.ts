import useGuild from "components/[guild]/hooks/useGuild"
import { useWatch } from "react-hook-form"
import useSWR from "swr"

const useDiscordRoleMemberCount = () => {
  const { platforms } = useGuild()
  const serverId = platforms?.[0]?.platformId

  const roleId = useWatch({ name: "discordRoleId" })

  const shouldFetch = roleId?.length > 0 && serverId?.length > 0

  const { isValidating, data, error } = useSWR(
    shouldFetch ? `/discord/memberCount/${serverId}/${roleId}` : null
  )

  return {
    memberCount: data,
    error,
    isLoading: isValidating,
  }
}

export default useDiscordRoleMemberCount
