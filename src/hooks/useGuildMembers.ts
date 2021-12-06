import { useMemo } from "react"
import { Role } from "temporaryData/types"

const unique = (value, index, self): boolean => self.indexOf(value) === index

const useGuildMembers = (
  roleDataArray: Array<{ guildId: number; roleId: number; role: Role }>
) =>
  useMemo(
    () =>
      roleDataArray
        ?.map((roleData) => roleData.role.members)
        ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
        ?.filter(unique) || [],
    [roleDataArray]
  )

export default useGuildMembers
