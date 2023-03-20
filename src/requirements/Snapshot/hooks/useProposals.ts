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
    `/assets/snapshot/proposal`
  )

  const proposals =
    search || spaceId
      ? data?.filter((proposal) => {
          let shouldKeep = false
          if (spaceId) {
            shouldKeep = proposal.space.id === spaceId
          }

          if (search) {
            shouldKeep = proposal.title.toLowerCase().includes(search.toLowerCase())
          }

          return shouldKeep
        })
      : data

  return {
    proposals,
    isProposalsLoading: isValidating,
  }
}

export default useProposals
