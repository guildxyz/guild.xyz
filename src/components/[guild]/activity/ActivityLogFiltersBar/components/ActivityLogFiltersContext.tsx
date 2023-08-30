import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import { useActiveFiltersReducer } from "../hooks/useActiveFiltersReducer"

export type Filter = {
  filter: SupportedQueryParam
  value?: string
}

const SUPPORTED_SEARCH_OPTIONS = [
  "userId",
  "roleId",
  "requirementId",
  "rolePlatformId",
] as const
export type SupportedSearchOption = (typeof SUPPORTED_SEARCH_OPTIONS)[number]

export const SUPPORTED_QUERY_PARAMS = [
  "order",
  "limit",
  "offset",
  "tree",
  "before",
  "after",
  "action",
  "service",
  "guildId",
  "roleId",
  "userId",
  "requirementId",
  "rolePlatformId",
  "poapId",
] as const
export type SupportedQueryParam = (typeof SUPPORTED_QUERY_PARAMS)[number]

export const isSupportedQueryParam = (arg: any): arg is SupportedQueryParam =>
  typeof arg === "string" &&
  (SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam) ||
    SUPPORTED_QUERY_PARAMS.includes(arg.split(":")[0] as SupportedQueryParam))

const ActivityLogFiltersContext = createContext<{
  activeFilters: Filter[]
  addFilter: (filter: Filter) => void
  removeLastFilter: () => void
  removeFilter: (filterToRemove: Filter) => void
  updateFilter: (updatedFilter: Filter) => void
  clearFilters: () => void
  triggerSearch: () => void
}>(undefined)

const ActivityLogFiltersProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    if (activeFilters.length > 0) return
    const initialFilters: Filter[] = Object.entries(router.query)
      .map(([key, value]) =>
        isSupportedQueryParam(key) && value
          ? {
              filter: key,
              value: value.toString(),
            }
          : null
      )
      .filter(Boolean)

    dispatch({
      type: "setFilters",
      filters: initialFilters,
    })

    // TODO: don't know if we actually needed this inside FiltersInput, we'll need to check it
    // setInputValue?.("")
  }, [router.query])

  const [activeFilters, dispatch] = useActiveFiltersReducer([])

  // These are just wrappers for the dispatch actions, so we can use them in a cleaner way in our child components
  const addFilter = (filter: Filter) => dispatch({ type: "addFilter", filter })
  const removeLastFilter = () =>
    dispatch({
      type: "removeLastFilter",
    })
  const removeFilter = (filter: Filter) =>
    dispatch({
      type: "removeFilter",
      filter,
    })
  const updateFilter = (filter: Filter) => dispatch({ type: "updateFilter", filter })
  const clearFilters = () => dispatch({ type: "clearFilters" })

  const triggerSearch = () => {
    const query: ParsedUrlQuery = { ...router.query }

    const filters: SupportedQueryParam[] = [...SUPPORTED_SEARCH_OPTIONS, "action"]

    filters.forEach((filter) => {
      const relevantActiveFilter = activeFilters.find((f) => f.filter === filter)
      query[filter] = relevantActiveFilter?.value ?? ""
    })

    Object.entries(query).forEach(([key, value]) => {
      if (!value) {
        delete query[key]
      }
    })

    router.push({
      pathname: router.pathname,
      query,
    })
  }

  return (
    <ActivityLogFiltersContext.Provider
      value={{
        activeFilters,
        addFilter,
        removeLastFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        triggerSearch,
      }}
    >
      {children}
    </ActivityLogFiltersContext.Provider>
  )
}

const useActivityLogFilters = () => useContext(ActivityLogFiltersContext)

export { ActivityLogFiltersProvider, useActivityLogFilters }
