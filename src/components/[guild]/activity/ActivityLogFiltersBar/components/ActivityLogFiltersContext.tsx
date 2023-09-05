import { usePrevious } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { PlatformName, PlatformType, Role } from "types"
import { ACTION } from "../../constants"

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
  clearFilters: (filterTypesToClear?: SupportedQueryParam[]) => void
  getFilter: (id: string) => Filter | Record<string, never>
  isActiveFilter: (filterType: SupportedQueryParam) => boolean
  getFilteredRewardSuggestions: (inputValue: string) => RewardSuggestion[]
  getFilteredRoleSuggestions: (inputValue: string) => Role[]
  getFilteredActionSuggestions: (inputValue: string) => ACTION[]
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

  const clearFilters = (filterTypesToClear?: SupportedQueryParam[]) => {
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
      const relevantActiveFilter = activeFilters.find((f) => f.filter === filter)
      newQuery[filter] = relevantActiveFilter?.value ?? ""
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
    }) ?? []

  const getFilteredRoleSuggestions = (inputValue: string) =>
    roles?.filter((role) => {
      const lowerCaseInputValue = inputValue?.trim().toLowerCase()
      return (
        role.name.toLowerCase().includes(lowerCaseInputValue) ||
        "role".includes(lowerCaseInputValue)
      )
    }) ?? []

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
