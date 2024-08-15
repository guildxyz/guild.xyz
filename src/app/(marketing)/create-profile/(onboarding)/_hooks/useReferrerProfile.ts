import { Schemas } from "@guildxyz/types"
import { useSearchParams } from "next/navigation"
import useSWRImmutable from "swr/immutable"
import { REFERRER_USER_SEARCH_PARAM_KEY } from "../constants"

export const useReferrerProfile = () => {
  const referrerUsername = useSearchParams()?.get(REFERRER_USER_SEARCH_PARAM_KEY)
  return {
    ...useSWRImmutable<Schemas["Profile"]>(`/v2/profiles/${referrerUsername}`),
    referrerUsername,
  }
}
