import REQUIREMENTS from "requirements"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchProfiles = ([endpoint, searchQuery]) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        searchProfiles(request: { query: "${searchQuery}", limit: TwentyFive}) {
          items {
            handle {
              localName
            },
            metadata {
              picture {
                ... on ImageSet {
                  optimized {
                    uri
                  }
                }
              }
            }
          }
        }
      }`,
    },
  }).then((res) => res?.data?.searchProfiles?.items)

const useLensProfiles = (searchQuery: string) => {
  const { data, isLoading } = useSWRImmutable(
    searchQuery.length > 0 ? ["https://api-v2.lens.dev", searchQuery] : null,
    fetchProfiles
  )

  return {
    handles: data?.map(({ handle: { localName }, metadata }) => ({
      label: localName,
      value: localName,
      img: metadata?.picture?.optimized?.uri ?? (REQUIREMENTS.LENS.icon as string),
    })),
    isLoading,
  }
}

export default useLensProfiles
