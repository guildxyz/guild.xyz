import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useScrollEffect from "hooks/useScrollEffect"
import { useRouter } from "next/router"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react"
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"
import { PlatformName, Requirement } from "types"
import {
  SupportedQueryParam,
  isSupportedQueryParam,
} from "./ActivityLogFiltersBar/components/ActivityLogFiltersContext"

import { useUserPublic } from "@/hooks/useUserPublic"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import {
  ADMIN_ACTIONS,
  ActivityLogAction,
  ActivityLogActionGroup,
  USER_ACTIONS,
} from "./constants"

const DEFAULT_LIMIT = 50
const SCROLL_PADDING = 40

export type ActivityLogActionResponse = {
  entries: ActivityLogAction[]
  values: {
    guilds: { id: number; name: string }[]
    requirements: Requirement[]
    rolePlatforms: {
      id: number
      platformId: number
      guildId: number
      platformRoleId: string
      platformName: PlatformName
      platformGuildId: string
      platformGuildName: string
      data?: Record<string, any>
    }[]
    roles: { id: number; name: string }[]
    users: { id: number; address: string }[]
    forms: { id: number; name: string }[]
  }
}

const transformActivityLogInfiniteResponse = (
  rawResponse: ActivityLogActionResponse[]
): ActivityLogActionResponse => {
  if (!rawResponse) return undefined

  const transformedResponse: ActivityLogActionResponse = {
    entries: [],
    values: {
      guilds: [],
      requirements: [],
      rolePlatforms: [],
      roles: [],
      users: [],
      forms: [],
    },
  }

  rawResponse.forEach((chunk) => {
    transformedResponse.entries.push(...chunk.entries)

    Object.keys(chunk.values).forEach((key) =>
      transformedResponse.values[key]?.push(...chunk.values[key])
    )
  })

  return transformedResponse
}

export type ActivityLogType = "user" | "guild" | "all"

type ActivityLogContextType = Omit<
  SWRInfiniteResponse<ActivityLogActionResponse>,
  "mutate" | "data"
> & {
  data: ActivityLogActionResponse
  mutate: () => void
  activityLogType: ActivityLogType
  actionGroup: ActivityLogActionGroup
  setActionGroup: Dispatch<SetStateAction<ActivityLogActionGroup>>
}

const ActivityLogContext = createContext<ActivityLogContextType>(undefined)

type Props = {
  withSearchParams?: boolean
  isInfinite?: boolean
  limit?: number
  userId?: number
  guildId?: number
}

const ActivityLogProvider = ({
  withSearchParams = true,
  isInfinite = true,
  limit = DEFAULT_LIMIT,
  userId,
  guildId,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { query, pathname } = useRouter()

  const { keyPair } = useUserPublic()

  const isSuperadminActivityLog = pathname.includes("/superadmin")

  const [actionGroup, setActionGroup] = useState(null)

  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const getKey = (
    pageIndex: number,
    previousPageData: ActivityLogActionResponse
  ) => {
    if (
      (!guildId && !userId && !isSuperadminActivityLog) ||
      !keyPair ||
      (previousPageData?.entries && !previousPageData.entries.length)
    )
      return null

    const queryWithRelevantParams: Partial<Record<SupportedQueryParam, string>> = {
      limit: limit.toString(),
      offset: (pageIndex * limit).toString(),
      tree: "true",
    }

    if (guildId) queryWithRelevantParams.guildId = guildId.toString()
    if (userId) queryWithRelevantParams.userId = userId.toString()

    const searchParams = new URLSearchParams(queryWithRelevantParams)

    if (withSearchParams) {
      Object.entries(query).forEach(([key, value]) => {
        if (isSupportedQueryParam(key)) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              searchParams.append(key, v.toString())
            })
          } else {
            searchParams.append(key, value.toString())
          }
        }
      })
    }

    if (!query.action) addActionGroupFilterParams(searchParams)

    return getKeyForSWRWithOptionalAuth(`/auditLog?${searchParams.toString()}`)
  }

  const addActionGroupFilterParams = (searchParams: URLSearchParams) => {
    const actions =
      actionGroup === ActivityLogActionGroup.AdminAction
        ? ADMIN_ACTIONS
        : actionGroup === ActivityLogActionGroup.UserAction
          ? USER_ACTIONS
          : /**
             * Adding all actions to the query by default in order to make sure we don't fetch
             * unsupported ones (e.g. the "click join on web" action)
             */
            [...USER_ACTIONS, ...ADMIN_ACTIONS]

    actions.forEach((action) => {
      searchParams.append("action", action.toString())
    })
  }

  const fetcherWithSign = useFetcherWithSign()

  const ogSWRInfiniteResponse = useSWRInfinite<ActivityLogActionResponse>(
    getKey,
    fetcherWithSign,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  )

  const activityLogType: ActivityLogType = isSuperadminActivityLog
    ? "all"
    : !!userId
      ? "user"
      : "guild"

  const value = {
    ...ogSWRInfiniteResponse,
    data: transformActivityLogInfiniteResponse(ogSWRInfiniteResponse.data),
    mutate: () => ogSWRInfiniteResponse.mutate(),
    activityLogType,
    actionGroup,
    setActionGroup,
  }

  useScrollEffect(() => {
    if (
      !isInfinite ||
      ogSWRInfiniteResponse.isValidating ||
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - SCROLL_PADDING
    )
      return

    ogSWRInfiniteResponse.setSize((prevSize) => prevSize + 1)
  }, [ogSWRInfiniteResponse.isValidating])

  return (
    <ActivityLogContext.Provider value={value}>
      {children}
    </ActivityLogContext.Provider>
  )
}

const useActivityLog = () => useContext(ActivityLogContext)

export { ActivityLogProvider, useActivityLog }
