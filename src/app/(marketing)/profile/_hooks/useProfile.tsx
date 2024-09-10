import { Schemas } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import { useParams } from "next/navigation"
import useSWRImmutable from "swr/immutable"

export const useProfile = (showOwnProfile?: boolean) => {
  const params = useParams<{ username: string }>()
  const user = useUser()
  const username = showOwnProfile ? user.guildProfile?.username : params?.username
  return useSWRImmutable<Schemas["Profile"]>(
    username ? `/v2/profiles/${username}` : null
  )
}
