import { Guild, Role, Schemas } from "@guildxyz/types"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const contributionFetcher = async (url: string) => {
  const contributions = (await fetcher(url)) as Schemas["ProfileContribution"][]
  const roleRequests = contributions.map(({ roleId, guildId }) =>
    fetcher(`/v2/guilds/${guildId}/roles/${roleId}`)
  ) as Promise<Role>[]
  const guildRequests = contributions.map(({ guildId }) =>
    fetcher(`/v2/guilds/${guildId}`)
  ) as Promise<Guild>[]
  const rawContribution = await Promise.all([...roleRequests, ...guildRequests])
  const roles = rawContribution.slice(0, roleRequests.length) as Role[]
  const guilds = rawContribution.slice(roleRequests.length) as Guild[]
  return guilds.map((guild) => ({
    guild,
    roles: roles.filter((_, i) => contributions[i].guildId === guild.id),
  }))
}

type ParsedContribution = Awaited<ReturnType<typeof contributionFetcher>>[number]

export const useContribution = (profileIdOrUsername: number | string) => {
  // const {id: userId} = useUserPublic()
  // const {data: memberships} = useSWR<Membership>(`/v2/users/${userId}/memberships`, fetcher)
  // console.log(memberships)
  return useSWR<ParsedContribution[]>(
    `/v2/profiles/${profileIdOrUsername}/contributions`,
    contributionFetcher
  )
}
