import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { Space } from "./useSpaces"

const fetchSpace = (_: string, id: string): Promise<Space> =>
  fetcher(process.env.NEXT_PUBLIC_SNAPSHOT_GRAPHQL, {
    method: "POST",
    body: {
      query: `
      {
        space(id: "${id}") {
          id,
          name
        }
      }
    `,
    },
  }).then((res) => res.data?.space)

const useSpace = (id: string): { space: Space; isSpaceLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    id ? ["snapshotSpace", id] : null,
    fetchSpace
  )

  return {
    space: data,
    isSpaceLoading: isValidating,
  }
}

export default useSpace
