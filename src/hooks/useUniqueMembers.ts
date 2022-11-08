import { useMemo } from "react"
import { Role } from "types"

const useUniqueMembers = (roles: Role[]) =>
  useMemo(() => {
    const allMembers = roles?.flatMap((role) => role.members) ?? []
    const uniqueMembers = [...new Set(allMembers)]
    const r = uniqueMembers?.filter((member) => typeof member === "string")
    return r
  }, [roles])

export default useUniqueMembers
