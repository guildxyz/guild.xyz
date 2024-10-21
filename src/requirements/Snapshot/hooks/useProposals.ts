import useSWRImmutable from "swr/immutable"
import { Proposal } from "../types"

const useProposals = (
  search: string,
  spaceId?: string
): { proposals?: Proposal[]; isProposalsLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable<Proposal[]>(
    `/v2/third-party/snapshot/proposals?search=${search ?? ""}`
  )

  const proposals = spaceId
    ? data?.filter((proposal) => {
        let shouldKeep = false
        if (spaceId) {
          shouldKeep = proposal.space.id === spaceId
        }

        return shouldKeep
      })
    : data

  return {
    proposals,
    isProposalsLoading: isValidating,
  }
}

export { useProposals }
