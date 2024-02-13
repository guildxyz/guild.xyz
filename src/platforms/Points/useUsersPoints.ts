import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"

const useUsersPoints = (pointId?) => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()

  const { data, ...rest } = useSWRWithOptionalAuth(
    `/v2/users/${userId}/points?guildId=${guildId}`,
    null,
    false,
    true
  )

  return {
    data: pointId ? data?.find((obj) => obj.guildPlatformId === pointId) : data,
    ...rest,
  }
}

export default useUsersPoints
