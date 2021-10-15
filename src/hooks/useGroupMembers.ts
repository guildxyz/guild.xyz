import { useMemo } from "react"
import { Guild } from "temporaryData/types"

const unique = (value, index, self): boolean => {
  return self.indexOf(value) === index
}

const useGroupMembers = (
  guildDataArray: Array<{ groupId: number; guildId: number; guild: Guild }>
) =>
  useMemo(
    () =>
      guildDataArray
        ?.map((guildData) => guildData.guild.members)
        .reduce((arr1, arr2) => arr1.concat(arr2))
        .filter(unique) || [],
    [guildDataArray]
  )

export default useGroupMembers
