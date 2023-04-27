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

export const useGalaxyCampaigns = (search = "") => {
  const { data, isValidating } = useSWRImmutable<GalaxyCampaign[]>(
    search.length > 0 ? `/assets/galxe/campaign?search=${search}` : null
  )

  return { campaigns: data, isLoading: isValidating }
}

export const useGalaxyCampaign = (
  id: string
): { campaign: GalaxyCampaign; isLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    id?.length >= 10 ? `/assets/galxe/campaign/${id}` : null
  )

  return { campaign: data, isLoading: isValidating }
}
