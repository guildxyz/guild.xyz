import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type Proposal = {
  id: string
  title: string
  state: "active" | "pending" | "closed"
  space: { id: string; name: string }
}

const fetch1000Proposals = (
  search: string,
  spaceId: string,
  skip: number
): Promise<Proposal[]> =>
  fetcher(process.env.NEXT_PUBLIC_SNAPSHOT_GRAPHQL, {
    method: "POST",
    body: {
      query: `
        {
          proposals (where: { title_contains: "${search}"${
        spaceId ? `, space: "${spaceId}"` : ""
      } }, first: 1000, skip: ${skip}, orderBy: "created", orderDirection: desc) {
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
  })
    .then((res) => res.data?.proposals ?? [])
    .catch(() => [])

const fetchProposals = async (
  _: string,
  search: string,
  spaceId: string
): Promise<Proposal[]> => {
  let proposals = []
  let skip = 0
  let newProposals = []

  do {
    newProposals = await fetch1000Proposals(search, spaceId, skip)
    proposals = proposals.concat(newProposals ?? [])
    skip += 1000
  } while (newProposals?.length > 0)

  return proposals
}

const useProposals = (
  search: string,
  spaceId?: string
): { proposals: Proposal[]; isProposalsLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    search?.length >= 3 || spaceId ? ["snapshotProposals", search, spaceId] : null,
    fetchProposals
  )

  return {
    proposals: data,
    isProposalsLoading: isValidating,
  }
}

export default useProposals
export type { Proposal }
