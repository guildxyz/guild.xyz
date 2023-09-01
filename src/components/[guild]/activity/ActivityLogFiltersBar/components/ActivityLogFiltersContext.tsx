import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import { PlatformName, PlatformType, Role } from "types"
import { ACTION } from "../../constants"
import { useActiveFiltersReducer } from "../hooks/useActiveFiltersReducer"

export type Filter = {
  id?: string
  filter: SupportedQueryParam
  value?: string
}

const SUPPORTED_SEARCH_OPTIONS = [
  "userId",
  "roleId",
  "rolePlatformId",
  "action",
] as const
export type SupportedSearchOption = (typeof SUPPORTED_SEARCH_OPTIONS)[number]

export const filterNames: Record<SupportedSearchOption, string> = {
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

type RewardSuggestion = {
  rolePlatformId: number
  platformName: PlatformName
  name: string
}

const hiddenActions: (keyof typeof ACTION)[] = [
  "UpdateUrlName",
  "UpdateLogoOrTitle",
  "UpdateDescription",
  "UpdateLogic",
  "UpdateTheme",
]

const auditLogActions = Object.entries(ACTION)
  .filter(([actionType]) => !hiddenActions.includes(ACTION[actionType]))
  .map(([, actionName]) => actionName)

const ActivityLogFiltersContext = createContext<{
  activeFilters: Filter[]
  addFilter: (filter: Filter) => void
  removeLastFilter: () => void
  removeFilter: (filterToRemove: Filter) => void
  updateFilter: (updatedFilter: Filter) => void
  clearFilters: () => void
  triggerSearch: () => void
  getFilter: (id: string) => Filter | Record<string, never>
  isActiveFilter: (filterType: SupportedQueryParam) => boolean
  getFilteredRewardSuggestions: (inputValue: string) => RewardSuggestion[]
  getFilteredRoleSuggestions: (inputValue: string) => Role[]
  getFilteredActionSuggestions: (inputValue: string) => ACTION[]
}>(undefined)

const ActivityLogFiltersProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [activeFilters, dispatch] = useActiveFiltersReducer([])
  const router = useRouter()

  useEffect(() => {
    if (activeFilters.length > 0) return
    const initialFilters: Filter[] = Object.entries(router.query)
      .map(([key, value]) =>
        isSupportedQueryParam(key) && value
          ? {
              id: crypto.randomUUID(),
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
  }, [router.query])

  // These are just wrappers for the dispatch actions, so we can use them in a cleaner way in our child components

  const addFilter = (filter: Filter) =>
    dispatch({ type: "addFilter", filter: { id: crypto.randomUUID(), ...filter } })
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

  const getFilter = (id: string) => activeFilters?.find((f) => f.id === id) ?? {}

  const isActiveFilter = (filterType: SupportedQueryParam): boolean =>
    activeFilters?.some((f) => f.filter === filterType)

  const { roles, guildPlatforms } = useGuild()

  const rewardSuggestions: RewardSuggestion[] = roles
    ?.flatMap((role) => role.rolePlatforms)
    .map((rp) => {
      const role = roles.find((r) => r.id === rp.roleId)
      const guildPlatform = guildPlatforms.find((gp) => gp.id === rp.guildPlatformId)
      const name =
        guildPlatform?.platformGuildName ?? guildPlatform?.platformGuildData?.name

      return {
        rolePlatformId: rp.id,
        platformName: PlatformType[guildPlatform?.platformId] as PlatformName,
        name:
          guildPlatform?.platformId === PlatformType.DISCORD
            ? `${role.name} - ${name}`
            : name,
      }
    })

  const getFilteredRewardSuggestions = (inputValue: string) =>
    rewardSuggestions?.filter((reward) => {
      const lowerCaseInputValue = inputValue?.trim().toLowerCase()

      if (!lowerCaseInputValue) return true

      return (
        reward.name.toLowerCase().includes(lowerCaseInputValue) ||
        "reward".includes(lowerCaseInputValue)
      )
    })

  const getFilteredRoleSuggestions = (inputValue: string) =>
    roles?.filter((role) => {
      const lowerCaseInputValue = inputValue?.trim().toLowerCase()
      return (
        role.name.toLowerCase().includes(lowerCaseInputValue) ||
        "role".includes(lowerCaseInputValue)
      )
    })

  const getFilteredActionSuggestions = (inputValue: string) =>
    auditLogActions.filter((action) => {
      const lowerCaseInputValue = inputValue.toLowerCase()
      return (
        action.includes(lowerCaseInputValue) ||
        "action".includes(lowerCaseInputValue)
      )
    })

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
        getFilter,
        isActiveFilter,
        getFilteredRewardSuggestions,
        getFilteredRoleSuggestions,
        getFilteredActionSuggestions,
      }}
    >
      {children}
    </ActivityLogFiltersContext.Provider>
  )
}

const useActivityLogFilters = () => useContext(ActivityLogFiltersContext)

export { ActivityLogFiltersProvider, useActivityLogFilters }
