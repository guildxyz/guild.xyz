import useSWRImmutable from "swr/immutable"
import { GalaxyCampaign } from "types"

export const useGalaxyCampaigns = () => {
  const { data, isValidating } = useSWRImmutable<GalaxyCampaign[]>(
    "/assets/galaxy-campaigns"
  )

  return { campaigns: data, isLoading: isValidating }
}

export const useGalaxyCampaign = (
  id: string
): { campaign: GalaxyCampaign; isLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    id ? `/assets/galaxy-campaigns/${id}` : null
  )

  return { campaign: data, isLoading: isValidating }
}
