import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { Proposal } from "./useProposals"

const fetchProposal = (_: string, id: string): Promise<Proposal> =>
  fetcher(process.env.NEXT_PUBLIC_SNAPSHOT_GRAPHQL, {
    method: "POST",
    body: {
      query: `
      {
        proposal(id: "${id}") {
          id,
          title,
          state,
          space {
            id,
            name
          }
        }
      }
    `,
    },
  }).then((res) => res.data?.proposal)

const useProposal = (
  id: string
): { proposal: Proposal; isProposalLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    id ? ["snapshotProposal", id] : null,
    fetchProposal
  )

  return {
    proposal: data,
    isProposalLoading: isValidating,
  }
}

export default useProposal
