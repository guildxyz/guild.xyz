import { ColumnFiltersState, SortingState } from "@tanstack/react-table"

const parseFiltersFromQuery = (query): ColumnFiltersState => {
  const filtersArray = []

  if (query.search) filtersArray.push({ id: "identity", value: query.identity })
  if (query.roleIds)
    filtersArray.push({
      id: "roles",
      value: {
        roleIds: Array.isArray(query.roleIds)
          ? query.roleIds.map((id) => parseInt(id))
          : [parseInt(query.roleIds)],
        logic: query.logic,
      },
    })

  return filtersArray
}

const parseSortingFromQuery = (query): SortingState => {
  if (!query.orderBy) return []

  return [{ id: query.orderBy, desc: query.orderByDesc }]
}

const buildQueryStringFromState = (columnFilters, sorting) => {
  const query = new URLSearchParams()

  const identityFilter = columnFilters.find((filter) => filter.id === "identity")
  const rolesFilter = columnFilters.find((filter) => filter.id === "roles")

  if (identityFilter?.value) query.set("search", identityFilter.value)
  if (rolesFilter?.value?.roleIds?.length) {
    rolesFilter.value.roleIds.forEach((roleId) => query.append("roleIds", roleId))

    if (rolesFilter?.value?.logic) query.set("logic", rolesFilter.value.logic)
  }
  if (sorting.length) {
    query.set("orderBy", sorting[0].id)
    if (sorting[0].desc) query.set("orderByDesc", "true")
  }

  return query.toString()
}

export { buildQueryStringFromState, parseFiltersFromQuery, parseSortingFromQuery }
