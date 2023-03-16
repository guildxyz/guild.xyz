import useGuild from "components/[guild]/hooks/useGuild"
import useSWRInfinite from "swr/infinite"
import { AuditLogAction } from "../constants"

// TODO: add filters, limit, etc.
const LIMIT = 10

const useAuditLog = () => {
  const { id } = useGuild()

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!id || (previousPageData && !previousPageData.length)) return null
    return `/auditLog?tree=true&guildId=${id}&limit=${LIMIT}&offset=${pageIndex}`
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
