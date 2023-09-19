import { ColumnFiltersState, SortingState } from "@tanstack/react-table"

const parseFiltersFromQuery = (query): ColumnFiltersState => {
  const filtersArray = []

  if (query.identity) filtersArray.push({ id: "identity", value: query.identity })
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

const buildQueryFromState = (columnFilters, sorting) => {
  const query = {} as any

  const identityFilter = columnFilters.find((filter) => filter.id === "identity")
  const rolesFilter = columnFilters.find((filter) => filter.id === "roles")

  if (identityFilter?.value) query.identity = identityFilter.value
  if (rolesFilter?.value?.roleIds?.length) {
    query.roleIds = rolesFilter.value.roleIds
    if (rolesFilter?.value?.logic) query.logic = rolesFilter.value.logic
  }
  if (sorting.length) {
    query.orderBy = sorting[0].id
    if (sorting[0].desc) query.orderByDesc = true
  }

  return query
}

export { buildQueryFromState, parseFiltersFromQuery, parseSortingFromQuery }
