import useSWRImmutable from "swr/immutable"
import { GalaxyCampaign } from "types"

const useGalaxyCampaign = (
  id: string
): { campaign: GalaxyCampaign; isLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    id ? `/assets/galaxy-campaigns/${id}` : null
  )

  return { campaign: data, isLoading: isValidating }
}

export default useGalaxyCampaign
