import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"

const unique = (value, index, self): boolean => self.indexOf(value) === index

const useGuildMembers = () => {
  const { roles } = useGuild()

  return useMemo(
    () =>
      roles
        ?.map((role) => role.members)
        ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
        ?.filter(unique)
        ?.filter((member) => typeof member === "string") || [],
    [roles]
  )
}

export default useGuildMembers
