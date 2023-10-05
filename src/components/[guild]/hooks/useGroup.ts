import { useRouter } from "next/router"
import useGuild from "./useGuild"

const useGroup = () => {
  const { groups } = useGuild()
  const { query } = useRouter()

  return query.group ? groups?.find((g) => g.urlName === query.group) : null
}

export default useGroup
