import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"

const usePoapLinks = (
  poapId: number
): {
  poapLinks: { total: number; claimed: number }
  isPoapLinksLoading: boolean
  mutate: KeyedMutator<any>
} => {
  const {
    data: poapLinks,
    isValidating: isPoapLinksLoading,
    mutate,
  } = useSWRImmutable(poapId ? `/assets/poap/links/${poapId}` : null)

  return { poapLinks, isPoapLinksLoading, mutate }
}

export default usePoapLinks
