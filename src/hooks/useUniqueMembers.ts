import { useMemo } from "react"
import { Role } from "types"

const useUniqueMembers = (roles: Role[], additionalMembers: string[] = []) =>
  useMemo(() => {
    const allMembers = (roles?.flatMap((role) => role.members) ?? []).concat(
      additionalMembers
    )
    const uniqueMembers = [...new Set(allMembers)]
    const r = uniqueMembers?.filter((member) => typeof member === "string")
    return r
  }, [roles, additionalMembers])

export default useUniqueMembers
