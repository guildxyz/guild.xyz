import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { env } from "env"
import useSWRImmutable from "swr/immutable"

const useClaimedRoles = () => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()

  return useSWRImmutable<
    {
      guildId: number
      roleIds: number[]
    }[]
  >(
    !!userId && !!guildId
      ? `${env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/claims?format=role&guildId=${guildId}`
      : null
  )
}

export default useClaimedRoles
