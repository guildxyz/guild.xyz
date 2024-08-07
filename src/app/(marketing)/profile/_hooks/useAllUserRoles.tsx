import { useUserPublic } from "@/hooks/useUserPublic"
import { MembershipResult, Role } from "@guildxyz/types"
import useSWR from "swr"
import fetcher from "utils/fetcher"
// import { parsedContributionFetcher } from "./useContribution"

type RoleWithGuildId = Role & Pick<MembershipResult, "guildId">
const roleFetcher = async (url: string) => {
  const memberships = (await fetcher(url)) as MembershipResult[]
  // const linearMemberships: { roleId: number; guildId: number }[] = []
  // for (const membership of memberships) {
  //   linearMemberships.push(
  //     ...membership.roleIds.map((roleId) => ({
  //       roleId,
  //       guildId: membership.guildId,
  //     }))
  //   )
  // }

  const roleRequests = memberships.reduce<Promise<RoleWithGuildId>[]>(
    (acc, curr) => [
      ...acc,
      ...curr.roleIds.map(
        async (roleId) =>
          ({
            ...(await fetcher(`/v2/guilds/${curr.guildId}/roles/${roleId}`)),
            guildId: curr.guildId,
          }) as Promise<RoleWithGuildId>
      ),
    ],
    []
  )
  return Promise.all(roleRequests)
  // const guildRequests = contributions.map(({ guildId }) =>
  //   fetcher(`/v2/guilds/${guildId}`)
  // ) as Promise<Guild>[]
  // const rawContribution = await Promise.all([...roleRequests, ...guildRequests])
  // const roles = rawContribution.slice(0, roleRequests.length) as Role[]

  // return parsedContributionFetcher(linearMemberships)
}

export const useAllUserRoles = () => {
  const { id: userId } = useUserPublic()
  return useSWR(`/v2/users/${userId}/memberships`, roleFetcher)
}
