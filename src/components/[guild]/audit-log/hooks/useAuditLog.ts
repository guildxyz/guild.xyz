import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"
import { PlatformName, Requirement } from "types"
import { AuditLogAction } from "../constants"

const LIMIT = 25

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

type AuditLogActionResponse = {
  entries: AuditLogAction[]
  values: {
    guilds: { id: number; name: string }[]
    poaps: any[] // TODO
    requirements: Requirement[]
    rolePlatforms: {
      id: number
      platformId: number
      guildId: number
      platformRoleId: string
      platformName: PlatformName
      platformGuildId: string
      platformGuildName: string
    }[]
    roles: { id: number; name: string }[]
    users: { id: number; address: string }[]
  }
}

const isSupportedQueryParam = (arg: any): arg is SupportedQueryParam => {
  if (typeof arg !== "string") return false
  return SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam)
}

const useAuditLog = (): Omit<
  SWRInfiniteResponse<AuditLogActionResponse>,
  "mutate" | "data"
> & { data: AuditLogActionResponse; mutate: () => void } => {
  const { id } = useGuild()

  const { query } = useRouter()

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!id) return null

    const queryWithRelevantParams: Partial<Record<SupportedQueryParam, string>> = {
      guildId: id.toString(),
      limit: LIMIT.toString(),
      offset: (pageIndex * LIMIT).toString(),
      tree: "true",
    }

    Object.entries(query).forEach(([key, value]) => {
      if (isSupportedQueryParam(key)) queryWithRelevantParams[key] = value.toString()
    })

    const searchParams = new URLSearchParams(queryWithRelevantParams).toString()

    return `/auditLog?${searchParams}`
  }

  const swrResponse = useSWRInfinite<AuditLogActionResponse>(getKey, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
  })

  const searchQuery = query.search?.toString()

  // return {
  //   ...infiniteData,
  //   data: searchQuery?.length
  //     ? infiniteData.data?.map((chunk) =>
  //         chunk.filter((actionData) =>
  //           actionData.action.toLowerCase().includes(searchQuery.toLowerCase())
  //         )
  //       )
  //     : infiniteData.data,
  // }

  return {
    ...swrResponse,
    data: transformAuditLogInfiniteResponse(swrResponse.data),
    mutate: () => swrResponse.mutate(),
  }
}

const transformAuditLogInfiniteResponse = (
  rawResponse: AuditLogActionResponse[]
): AuditLogActionResponse => {
  if (!rawResponse) return undefined

  const transformedResponse: AuditLogActionResponse = {
    entries: [],
    values: {
      guilds: [],
      poaps: [],
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

export default useAuditLog
