import { useCallback, useMemo } from "react"
import useSWRInfinite from "swr/infinite"
import { PlatformAccountDetails, Visibility } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useGuild from "../hooks/useGuild"

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
  joinedAt: string
  roles: {
    hidden?: CrmRole[]
    public: CrmRole[]
  }
}

const LIMIT = 100

const useMembers = (queryString) => {
  const { roles, id } = useGuild()

  const hiddenRoleIds = roles
    ?.filter((role) => role.visibility === Visibility.HIDDEN)
    ?.map((role) => role.id)

  const getKey = useCallback(
    (pageIndex, previousPageData) => {
      if (!id || (previousPageData && !previousPageData.length)) return null

      const pagination = `offset=${pageIndex * LIMIT}&limit=${LIMIT}`

      return `/v2/crm/guilds/${id}/members?${[queryString, pagination].join("&")}`
    },
    [queryString, id]
  )

  const fetcherWithSign = useFetcherWithSign()
  const fetchMembers = useCallback(
    (url: string) =>
      fetcherWithSign([
        url,
        {
          method: "GET",
          body: {},
        },
      ]).then((res) => {
        if (!hiddenRoleIds.length)
          return res.map((user) => ({ ...user, roles: { public: user.roleIds } }))

        return res.map((user) => ({
          ...user,
          roles: {
            hidden: user.roleIds.filter((role) =>
              hiddenRoleIds.includes(role.roleId)
            ),
            public: user.roleIds.filter(
              (role) => !hiddenRoleIds.includes(role.roleId)
            ),
          },
        }))
      }),
    [hiddenRoleIds, fetcherWithSign]
  )

  const { data, ...rest } = useSWRInfinite<Member[]>(getKey, fetchMembers, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
    revalidateOnMount: true,
  })

  const flattenedData = useMemo(() => data?.flat(), [data])

  return {
    data: flattenedData,
    ...rest,
  }
}

export default useMembers
export type { CrmRole, Member }
