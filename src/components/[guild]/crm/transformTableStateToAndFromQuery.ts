import { ColumnFiltersState, SortingState } from "@tanstack/react-table"

const parseFiltersFromQuery = (query): ColumnFiltersState => {
  const filtersArray = []

  if (query.search) filtersArray.push({ id: "identity", value: query.search })
  if (query.roleId)
    filtersArray.push({
      id: "roles",
      value: {
        roleIds: Array.isArray(query.roleId)
          ? query.roleId.map((id) => parseInt(id))
          : [parseInt(query.roleId)],
        logic: query.logic,
      },
    })

  return filtersArray
}

const parseSortingFromQuery = (query): SortingState => {
  if (!query.sortBy) return []

  return [{ id: query.sortBy, desc: query.sortOrder === "desc" }]
}

const buildQueryStringFromState = (columnFilters, sorting) => {
  const query = new URLSearchParams()

  const identityFilter = columnFilters.find((filter) => filter.id === "identity")
  const rolesFilter = columnFilters.find((filter) => filter.id === "roles")

  if (identityFilter?.value) query.set("search", identityFilter.value)
  if (rolesFilter?.value?.roleIds?.length) {
    rolesFilter.value.roleIds.forEach((roleId) => query.append("roleId", roleId))

    if (rolesFilter?.value?.logic) query.set("logic", rolesFilter.value.logic)
  }
  if (sorting.length) {
    query.set("sortBy", sorting[0].id)
    query.set("sortOrder", sorting[0].desc ? "desc" : "asc")
  }

  return query.toString()
}

export { buildQueryStringFromState, parseFiltersFromQuery, parseSortingFromQuery }
