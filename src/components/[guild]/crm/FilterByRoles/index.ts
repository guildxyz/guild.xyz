import { FilterFn } from "@tanstack/react-table"
import FilterByRoles from "./FilterByRoles"

export const roleFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const filteredRoleIds = value.roleIds
  if (!filteredRoleIds?.length) return true

  const usersRoleIds = row.getValue(columnId) as string[]

  if (value.logic === "all") {
    return filteredRoleIds.every((roleId) => usersRoleIds.includes(roleId))
  }

  return usersRoleIds.some((roleId) => filteredRoleIds.includes(roleId))
}

export default FilterByRoles
