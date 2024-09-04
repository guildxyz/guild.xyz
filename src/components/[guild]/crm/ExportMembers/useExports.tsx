import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"

export const crmOrderByParams = { joinedAt: "join date", roles: "number of roles" }
type CRMOrderByParams = keyof typeof crmOrderByParams

export type ExportData = {
  id: number
  bucketName: string
  filename: string
  status: "STARTED" | "FINISHED" | "FAILED"
  data: {
    count: number
    params: {
      search: string
      roleIds: number[]
      logic: "all" | "some"
      order: CRMOrderByParams
      sortOrder: "desc" | "asc"
    }
  }
  createdAt: string
  updatedAt: string
}

export type ExportsEndpoint = {
  exports: ExportData[]
}

const useExports = () => {
  const { id } = useGuild()
  const [shouldPoll, setShouldPoll] = useState(false)
  const fetcherWithSign = useFetcherWithSign()

  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()
  const fetchExports = (props) =>
    fetcherWithSign(props).then((res: ExportsEndpoint) => {
      if (res.exports.some((exp) => exp.status === "STARTED")) setShouldPoll(true)
      else setShouldPoll(false)

      return res.exports
    })

  return useSWRImmutable<ExportData[]>(
    getKeyForSWRWithOptionalAuth(`/v2/crm/guilds/${id}/exports`),
    fetchExports,
    {
      keepPreviousData: true,
      refreshInterval: shouldPoll ? 500 : null,
    }
  )
}

export default useExports
