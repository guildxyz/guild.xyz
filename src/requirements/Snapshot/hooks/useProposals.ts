import useSWRImmutable from "swr/immutable"

export type Proposal = {
  id: string
  title: string
  state: "active" | "pending" | "closed"
  space: { id: string; name: string }
}

const useProposals = (
  search: string,
  spaceId?: string
): { proposals: Proposal[]; isProposalsLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable<Proposal[]>(
    search?.length >= 3 || spaceId
      ? `/assets/snapshot/proposals?search=${search ?? ""}&spaceId=${spaceId ?? ""}`
      : null
  )

  return {
    proposals: data,
    isProposalsLoading: isValidating,
  }
}

export default useProposals
