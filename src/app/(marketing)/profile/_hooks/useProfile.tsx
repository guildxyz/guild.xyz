import { Schemas } from "@guildxyz/types"
import { useParams } from "next/navigation"
import useSWRImmutable from "swr/immutable"

export const useProfile = () => {
  const params = useParams<{ username: string }>()
  return useSWRImmutable<Schemas["Profile"]>(
    params?.username ? `/v2/profiles/${params.username}` : null
  )
}
