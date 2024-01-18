import useScrollEffect from "hooks/useScrollEffect"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"
import { OneOf, PlatformName, Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import { useUserPublic } from "../hooks/useUser"
import {
  isSupportedQueryParam,
  SupportedQueryParam,
} from "./ActivityLogFiltersBar/components/ActivityLogFiltersContext"

import {
  ACTION,
  ActivityLogAction,
  ActivityLogActionGroup,
  ADMIN_ACTIONS,
  HIDDEN_ACTIONS,
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

type ActivityLogContextType = Omit<
  SWRInfiniteResponse<ActivityLogActionResponse>,
  "mutate" | "data"
> & {
  data: ActivityLogActionResponse
  mutate: () => void
  isUserActivityLog: boolean
  actionGroup: ActivityLogActionGroup
  setActionGroup: (value: ActivityLogActionGroup) => void
  withActionGroups: boolean
}

const ActivityLogContext = createContext<ActivityLogContextType>(undefined)

type Props = {
  withSearchParams?: boolean
  isInfinite?: boolean
  limit?: number
  withActionGroups?: boolean
} & OneOf<{ userId: number }, { guildId: number }>

const getUserActions = () => {
  return Object.values(ACTION).filter(
    (action) => !ADMIN_ACTIONS.includes(action) && !HIDDEN_ACTIONS.includes(action)
  )
}

const ActivityLogProvider = ({
  withSearchParams = true,
  isInfinite = true,
  limit = DEFAULT_LIMIT,
  withActionGroups = false,
  userId,
  guildId,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { query } = useRouter()

  const { keyPair } = useUserPublic()

  const [actionGroup, setActionGroup] = useState(
    withActionGroups ? ActivityLogActionGroup.UserAction : null
  )

  const getKey = (
    pageIndex: number,
    previousPageData: ActivityLogActionResponse
  ) => {
    if (
      (!guildId && !userId) ||
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

    let searchParams = new URLSearchParams(queryWithRelevantParams)

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

    if (!query["action"]) searchParams = addActionGroupFilterParams(searchParams)

    return `/auditLog?${searchParams.toString()}`
  }

  const addActionGroupFilterParams = (searchParams: URLSearchParams) => {
    const actions =
      actionGroup === ActivityLogActionGroup.AdminAction
        ? ADMIN_ACTIONS
        : actionGroup === ActivityLogActionGroup.UserAction
        ? getUserActions()
        : []

    actions.forEach((action) => {
      searchParams.append("action", action.toString())
    })

    return searchParams
  }
  const fetcherWithSign = useFetcherWithSign()
  const fetchActivityLogPage = (url: string) =>
    fetcherWithSign([
      url,
      {
        method: "GET",
        body: {},
      },
    ])
  const ogSWRInfiniteResponse = useSWRInfinite<ActivityLogActionResponse>(
    getKey,
    fetchActivityLogPage,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  )

  const value = {
    ...ogSWRInfiniteResponse,
    data: transformActivityLogInfiniteResponse(ogSWRInfiniteResponse.data),
    mutate: () => ogSWRInfiniteResponse.mutate(),
    isUserActivityLog: !!userId,
    withActionGroups: withActionGroups,
    actionGroup: actionGroup,
    setActionGroup: setActionGroup,
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
