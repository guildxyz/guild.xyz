import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type Space = {
  id: string
  name: string
}

const fetch1000Spaces = (skip: number): Promise<Space[]> =>
  fetcher(process.env.NEXT_PUBLIC_SNAPSHOT_GRAPHQL, {
    method: "POST",
    body: {
      query: `
        {
          spaces (first: 1000, skip: ${skip}, orderBy: "created", orderDirection: desc) {
            id,
            name,
          }
        }
      `,
    },
  })
    .then((res) => res.data?.spaces ?? [])
    .catch(() => [])

const fetchSpaces = async (): Promise<Space[]> => {
  let spaces = []
  let skip = 0
  let newSpaces = []

  do {
    newSpaces = await fetch1000Spaces(skip)
    spaces = spaces.concat(newSpaces ?? [])
    skip += 1000
  } while (newSpaces?.length > 0)

  return spaces
}

const useSpaces = (): { spaces: Space[]; isSpacesLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable("snapshotSpaces", fetchSpaces)

  return {
    spaces: data,
    isSpacesLoading: isValidating,
  }
}

export default useSpaces
export type { Space }
