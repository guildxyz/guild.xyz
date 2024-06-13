import { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { ParsedUrlQuery } from "querystring"

const parseFiltersFromQuery = (query: ParsedUrlQuery): ColumnFiltersState => {
  const filtersArray = []

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  if (query.search) filtersArray.push({ id: "identity", value: query.search })
  if (query.roleIds)
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
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

const parseSortingFromQuery = (query: ParsedUrlQuery): SortingState => {
  if (!query.sortBy) return []

  return [{ id: query.sortBy.toString(), desc: query.sortOrder === "desc" }]
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
    query.set("sortBy", sorting[0].id)
    query.set("sortOrder", sorting[0].desc ? "desc" : "asc")
  }

  return query.toString()
}

export { buildQueryStringFromState, parseFiltersFromQuery, parseSortingFromQuery }
