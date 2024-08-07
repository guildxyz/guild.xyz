import { useUserPublic } from "@/hooks/useUserPublic"
import { MembershipResult, Role } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type RoleWithGuildId = Role & Pick<MembershipResult, "guildId">
const roleFetcher = async (url: string) => {
  const memberships = (await fetcher(url)) as MembershipResult[]
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
}

export const useAllUserRoles = () => {
  const { id: userId } = useUserPublic()
  return useSWRImmutable(`/v2/users/${userId}/memberships`, roleFetcher)
}
