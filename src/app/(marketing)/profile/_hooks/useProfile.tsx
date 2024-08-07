import { Schemas } from "@guildxyz/types"
import { useParams } from "next/navigation"
import useSWR from "swr"
import fetcher from "utils/fetcher"

export const useProfile = () => {
  const params = useParams<{ username: string }>()
  return useSWR<Schemas["Profile"]>(
    params?.username ? `/v2/profiles/${params.username}` : null,
    fetcher
  )
}
