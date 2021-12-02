import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Guild } from "temporaryData/types"

const useGuild = (guildId?): Guild => {
  const router = useRouter()

  const { data } = useSWRImmutable(`/role/urlName/${guildId ?? router.query.guild}`)

  return data
}

export default useGuild
