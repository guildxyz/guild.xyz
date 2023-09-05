import useScrollEffect from "hooks/useScrollEffect"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useContext } from "react"
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"
import { OneOf, PlatformName, Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useGuild from "../hooks/useGuild"
import {
  isSupportedQueryParam,
  SupportedQueryParam,
} from "./ActivityLogFiltersBar/components/ActivityLogFiltersContext"
import { ACTION, ActivityLogAction } from "./constants"

const LIMIT = 50
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
    transformedResponse.entries.push(
      ...chunk.entries
        // We should remove this filter once these logs will have hierarchy!
        .filter(
          (entry) =>
            entry.action !== ACTION.SendReward &&
            entry.action !== ACTION.RevokeReward
        )
    )

    Object.keys(chunk.values).forEach((key) =>
      transformedResponse.values[key]?.push(...chunk.values[key])
    )
  })

  return transformedResponse
}

const ActivityLogContext = createContext<
  Omit<SWRInfiniteResponse<ActivityLogActionResponse>, "mutate" | "data"> & {
    data: ActivityLogActionResponse
    mutate: () => void
    baseUrl: string
  }
>(undefined)

type Props = { withSearchParams?: boolean; isInfinite?: boolean } & OneOf<
  { userId: number },
  { guildId: number }
>

const ActivityLogProvider = ({
  withSearchParams = true,
  isInfinite = true,
  userId,
  guildId,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { urlName } = useGuild(guildId)
  const { query } = useRouter()

  const getKey = (
    pageIndex: number,
    previousPageData: ActivityLogActionResponse
  ) => {
    if (
      (!guildId && !userId) ||
      (previousPageData?.entries && !previousPageData.entries.length)
    )
      return null

    const queryWithRelevantParams: Partial<Record<SupportedQueryParam, string>> = {
      limit: LIMIT.toString(),
      offset: (pageIndex * LIMIT).toString(),
      tree: "true",
    }

    if (guildId) queryWithRelevantParams.guildId = guildId.toString()
    if (userId) queryWithRelevantParams.userId = userId.toString()

    const searchParams = new URLSearchParams(queryWithRelevantParams)

    if (withSearchParams) {
      Object.entries(query).forEach(([key, value]) => {
        if (isSupportedQueryParam(key)) {
          const splitValue = value.toString().split(",")

          if (splitValue.length > 1) {
            splitValue.forEach((v) => {
              searchParams.append(key, v)
            })
          } else {
            searchParams.append(key, value.toString())
          }
        }
      })
    }

    return `/auditLog?${searchParams.toString()}`
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
    }
  )

  const value = {
    ...ogSWRInfiniteResponse,
    data: transformActivityLogInfiniteResponse(ogSWRInfiniteResponse.data),
    mutate: () => ogSWRInfiniteResponse.mutate(),
    baseUrl: userId ? "/profile/activity" : `/${urlName}/activity`,
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
