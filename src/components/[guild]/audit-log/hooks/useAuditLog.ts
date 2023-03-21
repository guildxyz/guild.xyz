import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import useSWRInfinite from "swr/infinite"
import { AuditLogAction } from "../constants"

// TODO: add filters, limit, etc.
const LIMIT = 10
export const SUPPORTED_QUERY_PARAMS = [
  "order",
  "limit",
  "offset",
  "tree",
  "before",
  "after",
  "actionName",
  "service",
  "guildId",
  "roleId",
  "userId",
  "requirementId",
  "rolePlatformId",
  "poapId",
] as const
export type SupportedQueryParam = (typeof SUPPORTED_QUERY_PARAMS)[number]

const isSupportedQueryParam = (arg: any): arg is SupportedQueryParam => {
  if (typeof arg !== "string") return false
  return SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam)
}

const useAuditLog = () => {
  const { id } = useGuild()

  const { query } = useRouter()

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!id || (previousPageData && !previousPageData.length)) return null

    const queryWithRelevantParams: Partial<Record<SupportedQueryParam, string>> = {
      guildId: id.toString(),
      limit: LIMIT.toString(),
      offset: pageIndex.toString(),
      tree: "true",
    }

    Object.entries(query).forEach(([key, value]) => {
      if (isSupportedQueryParam(key)) queryWithRelevantParams[key] = value.toString()
    })

    const searchParams = new URLSearchParams(queryWithRelevantParams).toString()

    return `/auditLog?${searchParams}`
  }

  const infiniteData = useSWRInfinite<AuditLogAction[]>(getKey, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
  })

  return infiniteData
}

export default useAuditLog
