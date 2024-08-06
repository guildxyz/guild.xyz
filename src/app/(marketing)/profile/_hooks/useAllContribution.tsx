import { MembershipResult } from "@guildxyz/types"
import useSWR from "swr"
import fetcher from "utils/fetcher"
import { parsedContributionFetcher } from "./useContribution"

const contributionFetcher = async (url: string) => {
  const memberships = (await fetcher(url)) as MembershipResult[]
  const linearMemberships: { roleId: number; guildId: number }[] = []
  for (const membership of memberships) {
    linearMemberships.push(
      ...membership.roleIds.map((roleId) => ({
        roleId,
        guildId: membership.guildId,
      }))
    )
  }
  return parsedContributionFetcher(linearMemberships)
}

export const useAllContribution = (userId: number) => {
  return useSWR(
    userId ? `/v2/users/${userId}/memberships` : null,
    contributionFetcher
  )
}
