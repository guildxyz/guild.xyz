import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"

const useGuildMembers = () => {
  const { roles } = useGuild()

  return useMemo(() => {
    const allMembers = roles?.flatMap((role) => role.members) ?? []
    const uniqueMembers = [...new Set(allMembers)]
    const r = uniqueMembers?.filter((member) => typeof member === "string")
    return r
  }, [roles])
}

export default useGuildMembers
