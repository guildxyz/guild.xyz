import useSWRImmutable from "swr/immutable"
import { GalaxyCampaign } from "types"

const useGalaxyCampaigns = (): {
  campaigns: Array<GalaxyCampaign>
  isLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable("/assets/galaxy-campaigns")

  return { campaigns: data, isLoading: isValidating }
}

export default useGalaxyCampaigns
