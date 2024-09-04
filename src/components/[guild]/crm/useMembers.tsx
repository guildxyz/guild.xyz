import { useUserPublic } from "@/hooks/useUserPublic"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { useCallback, useMemo } from "react"
import useSWRInfinite from "swr/infinite"
import { PlatformAccountDetails } from "types"
import useGuild from "../hooks/useGuild"
import { sortAccounts } from "./Identities"

type CrmRole = {
  roleId?: number
  requirementId?: number
  access?: boolean
  amount?: number
}

type Member = {
  userId: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  isShared: boolean
  joinedAt: string
  roles: {
    hidden?: CrmRole[]
    public: CrmRole[]
  }
}

const LIMIT = 50

const useMembers = (queryString: string) => {
  const { id } = useGuild()
  const { keyPair } = useUserPublic()

  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const getKey = useCallback(
    (pageIndex, previousPageData) => {
      if (!id || !keyPair) return null

      if (previousPageData && previousPageData.length < LIMIT) return null

      const pagination = `offset=${pageIndex * LIMIT}&limit=${LIMIT}`

      return getKeyForSWRWithOptionalAuth(
        `/v2/crm/guilds/${id}/members?${[queryString, pagination].join("&")}`
      )
    },
    [queryString, id, keyPair]
  )

  const fetcherWithSign = useFetcherWithSign()
  const fetchMembers = useCallback(
    (props) =>
      fetcherWithSign(props).then((res) =>
        res.map((user) => ({
          ...user,
          platformUsers: user.platformUsers.sort(sortAccounts),
          isShared: user.isShared === true || user.isShared === null,
          roles: {
            hidden: user.roles.filter((role) => role.visibility === "HIDDEN"),
            public: user.roles.filter((role) => role.visibility !== "HIDDEN"),
          },
        }))
      ),
    [fetcherWithSign]
  )

  const { data, mutate, ...rest } = useSWRInfinite<Member[]>(getKey, fetchMembers, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
    revalidateOnMount: true,
    keepPreviousData: true,
  })

  const flattenedData = useMemo(() => data?.flat(), [data])

  // Mutating the data on successful status update
  useActiveStatusUpdates(null, mutate)

  return {
    data: flattenedData,
    mutate,
    ...rest,
  }
}

export default useMembers
export type { CrmRole, Member }
