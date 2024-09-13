import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useContributions = () => {
  const { data: profileData } = useProfile()
  return useSWRImmutable<Schemas["Contribution"][]>(
    profileData ? `/v2/profiles/${profileData.username}/contributions` : null
  )
}
