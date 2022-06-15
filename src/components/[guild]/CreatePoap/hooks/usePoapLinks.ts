import useSWRImmutable from "swr/immutable"

const usePoapLinks = (poapId: number) =>
  useSWRImmutable(poapId ? `/assets/poap/links/${poapId}` : null)

export default usePoapLinks
