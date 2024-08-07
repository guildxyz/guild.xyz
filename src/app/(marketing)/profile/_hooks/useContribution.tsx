import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useContribution = () => {
  const { data: profileData } = useProfile()
  return useSWRImmutable<Schemas["ProfileContribution"][]>(
    profileData ? `/v2/profiles/${profileData.username}/contributions` : null
  )
}
