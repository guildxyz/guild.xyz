import { useUserPublic } from "@/hooks/useUserPublic"
import { MembershipResult } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"

export const useMemberships = () => {
  const { id: userId } = useUserPublic()
  return useSWRImmutable<MembershipResult[]>(
    userId === undefined ? null : `/v2/users/${userId}/memberships`
  )
}
