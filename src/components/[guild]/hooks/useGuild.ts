import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Guild } from "types"

const useGuild = (): Guild => {
  const router = useRouter()

  const { data } = useSWRImmutable(`/guild/urlName/${router.query.guild}`)

  return data
}

export default useGuild
