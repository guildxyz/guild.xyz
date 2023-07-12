import { FilterFn, SortingFn } from "@tanstack/react-table"
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

export const roleSort: SortingFn<any> = (
  rowA: any,
  rowB: any,
  columnId: any
): number => {
  const rolesLengthOfUserA = rowA.getValue(columnId).length
  const rolesLengthOfUserB = rowB.getValue(columnId).length

  return rolesLengthOfUserA > rolesLengthOfUserB ? 1 : -1
}

export default FilterByRoles
