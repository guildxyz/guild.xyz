import { usePrevious } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"

export type Filter = {
  id?: string
  filter: SupportedQueryParam
  value?: string
}

export const SUPPORTED_SEARCH_OPTIONS = [
  "userId",
  "roleId",
  "rolePlatformId",
  "action",
] as const
export type SupportedSearchOption = (typeof SUPPORTED_SEARCH_OPTIONS)[number]

export const FILTER_NAMES: Record<SupportedSearchOption, string> = {
  userId: "User",
  roleId: "Role",
  rolePlatformId: "Reward",
  action: "Action",
}

export const SUPPORTED_QUERY_PARAMS = [
  "order",
  "limit",
  "offset",
  "tree",
  "before",
  "after",
  "action",
  "guildId",
  "roleId",
  "userId",
  "rolePlatformId",
] as const
export type SupportedQueryParam = (typeof SUPPORTED_QUERY_PARAMS)[number]

export const isSupportedQueryParam = (arg: any): arg is SupportedQueryParam =>
  typeof arg === "string" &&
  SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam)

const ActivityLogFiltersContext = createContext<{
  activeFilters: Filter[]
  addFilter: (filter: Filter) => void
  removeLastFilter: () => void
  removeFilter: (filterToRemove: Filter) => void
  updateFilter: (updatedFilter: Filter) => void
  clearFilters: (filterTypesToClear: SupportedQueryParam[]) => void
  getFilter: (id: string) => Filter | Record<string, never>
  isActiveFilter: (filterType: SupportedQueryParam) => boolean
}>(undefined)

const ActivityLogFiltersProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const router = useRouter()
  const [initialSetupDone, setInitialSetupDone] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])

  useEffect(() => {
    if (initialSetupDone || !Object.entries(router.query).length) return

    const initialFilters: Filter[] = Object.entries(router.query)
      .map(([key, value]) => {
        if (!isSupportedQueryParam(key) || !value) return null

        if (Array.isArray(value)) {
          return value.map((singleValue) => ({
            id: crypto.randomUUID(),
            filter: key,
            value: singleValue.toString(),
          }))
        } else {
          return {
            id: crypto.randomUUID(),
            filter: key,
            value: value.toString(),
          }
        }
      })
      .flat()
      .filter(Boolean)

    setActiveFilters(initialFilters)
    setInitialSetupDone(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  const addFilter = (filter: Filter) =>
    setActiveFilters((prevActiveFilters) => [
      ...prevActiveFilters,
      { id: crypto.randomUUID(), ...filter },
    ])

  const updateFilter = (filter: Filter) =>
    setActiveFilters((prevActiveFilters) => {
      const modifiedFilters = [...prevActiveFilters]
      const filterToModify = modifiedFilters.find((f) => f.id === filter?.id)
      if (filterToModify) {
        filterToModify.value = filter.value
      }

      return modifiedFilters
    })

  const removeLastFilter = () =>
    setActiveFilters((prevActiveFilters) => {
      const modifiedFilters = [...prevActiveFilters]
      modifiedFilters.pop()
      return modifiedFilters
    })

  const removeFilter = (filter: Filter) =>
    setActiveFilters((prevActiveFilters) =>
      prevActiveFilters.filter((f) => f.id !== filter?.id)
    )

  const clearFilters = (filterTypesToClear: SupportedQueryParam[]) => {
    if (!filterTypesToClear?.length) {
      setActiveFilters([])
      return
    }

    setActiveFilters((prevActiveFilters) => [
      ...prevActiveFilters.filter(
        ({ filter }) => !filterTypesToClear.includes(filter)
      ),
    ])
  }

  const [query, setQuery] = useState<ParsedUrlQuery>({})
  const prevQuery = usePrevious(query)

  useEffect(() => {
    const newQuery: ParsedUrlQuery = { ...router.query }

    const filters: SupportedQueryParam[] = [
      ...SUPPORTED_SEARCH_OPTIONS,
      "before",
      "after",
    ]

    filters.forEach((filter) => {
      const relevantActiveFilters = activeFilters.filter((f) => f.filter === filter)

      if (relevantActiveFilters.length > 1) {
        newQuery[filter] = relevantActiveFilters.map((f) => f.value)
      } else {
        newQuery[filter] = relevantActiveFilters[0]?.value ?? ""
      }
    })

    Object.entries(newQuery).forEach(([key, value]) => {
      if (!value) {
        delete newQuery[key]
      }
    })

    setQuery(newQuery)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters])

  useEffect(() => {
    if (!query.guild || !Object.keys(prevQuery ?? {}).length) return

    let shouldPushRouter = false

    const allQueryParams = [
      ...new Set([...Object.keys(query), ...Object.keys(prevQuery ?? {})]),
    ]
    for (const queryParam of allQueryParams) {
      if (prevQuery[queryParam] !== query[queryParam]) shouldPushRouter = true
      if (!prevQuery[queryParam] && query[queryParam] === "")
        shouldPushRouter = false
    }

    if (shouldPushRouter)
      router.push({
        pathname: router.pathname,
        query,
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const getFilter = (id: string) => activeFilters?.find((f) => f.id === id) ?? {}

  const isActiveFilter = (filterType: SupportedQueryParam): boolean =>
    activeFilters?.some((f) => f.filter === filterType)

  return (
    <ActivityLogFiltersContext.Provider
      value={{
        activeFilters,
        addFilter,
        removeLastFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        getFilter,
        isActiveFilter,
      }}
    >
      {children}
    </ActivityLogFiltersContext.Provider>
  )
}

const useActivityLogFilters = () => useContext(ActivityLogFiltersContext)

export { ActivityLogFiltersProvider, useActivityLogFilters }
