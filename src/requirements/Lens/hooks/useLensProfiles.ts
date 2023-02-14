import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchProfiles = (endpoint: string, searchQuery: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        search(request: {
          query: "${searchQuery}",
          type: PROFILE,
          limit: 50
        }) {
          ... on ProfileSearchResult {
            items {
              ... on Profile {
                profileId: id,
                name
                handle
              }
            }
            pageInfo {
              totalCount
            }
          }
        }
      }`,
    },
  }).then((res) => res?.data?.search)

const useLensProfiles = (searchQuery: string) => {
  const { data, isValidating } = useSWRImmutable(
    searchQuery.length > 0 ? ["https://api.lens.dev", searchQuery] : null,
    fetchProfiles
  )

  return {
    handles: data?.items?.map((profile) => profile.handle),
    restCount: data?.pageInfo?.totalCount - 50,
    isLoading: isValidating,
  }
}

export default useLensProfiles
