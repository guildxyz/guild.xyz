import { useRouter } from "next/router"
import useGuild from "./useGuild"

const useGroup = (groupId?: number) => {
  const { groups } = useGuild()
  const { query } = useRouter()

  const groupIdToFind = groupId ?? query.group

  return groupIdToFind
    ? groups?.find((g) =>
        typeof groupIdToFind === "string"
          ? g.urlName === groupIdToFind
          : g.id === groupIdToFind
      )
    : null
}

export default useGroup
