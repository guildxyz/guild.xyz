import { useMemo } from "react"
import { Role } from "types"

const unique = (value, index, self): boolean => self.indexOf(value) === index

const useGuildMembers = (roleDataArray: Array<Role>) =>
  useMemo(
    () =>
      roleDataArray
        ?.map((role) => role.members)
        ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
        ?.filter(unique) || [],
    [roleDataArray]
  )

export default useGuildMembers
