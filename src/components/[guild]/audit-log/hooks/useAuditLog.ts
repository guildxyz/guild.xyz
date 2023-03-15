import useGuild from "components/[guild]/hooks/useGuild"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

// TODO: add filters, limit, etc.

const fetchAuditLog = (_: string, guildId: number) =>
  fetcher(`/auditLog?tree=true&guildId=${guildId}&limit=100`)

const useAuditLog = () => {
  const { id } = useGuild()

  return useSWRImmutable(id ? ["auditLog", id] : null, fetchAuditLog)
}

export default useAuditLog
