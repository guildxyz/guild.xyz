import useSWRImmutable from "swr/immutable"

const usePoapLinks = (
  poapId: number
): {
  poapLinks: { total: number; claimed: number }
  isPoapLinksLoading: boolean
} => {
  const { data: poapLinks, isValidating: isPoapLinksLoading } = useSWRImmutable(
    poapId ? `/assets/poap/links/${poapId}` : null
  )

  return { poapLinks, isPoapLinksLoading }
}

export default usePoapLinks
