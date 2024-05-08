import REQUIREMENTS from "requirements"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

export const LENS_API_URL = "https://api-v2.lens.dev"

export type LensProfile = {
  id
  handle: {
    localName: string
  }
  metadata?: {
    picture?: {
      optimized?: {
        uri?: string
      }
    }
  }
}

const fetchProfiles = ([_, searchQuery]): Promise<LensProfile[]> =>
  fetcher(LENS_API_URL, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        searchProfiles(request: { query: "${searchQuery}", limit: TwentyFive}) {
          items {
            id,
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
  const { mutate } = useSWRConfig()

  const { data, isLoading } = useSWRImmutable(
    searchQuery.length > 0 ? ["lensProfiles", searchQuery] : null,
    fetchProfiles,
    {
      onSuccess: (newData, _key, _config) => {
        newData.forEach((profile) =>
          mutate(["lensProfile", profile.id], profile, { revalidate: false })
        )
      },
    }
  )

  return {
    handles: data?.map(({ id, handle: { localName }, metadata }) => ({
      label: `${localName}.lens`,
      value: id,
      img: metadata?.picture?.optimized?.uri ?? (REQUIREMENTS.LENS.icon as string),
    })),
    isLoading,
  }
}

export default useLensProfiles
