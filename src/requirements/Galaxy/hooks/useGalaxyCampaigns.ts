import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"

type GalaxyCampaign = {
  id: string
  numberID: number
  name: string
  thumbnail: string
  chain: Chain
  space?: {
    alias: string
  }
}

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
