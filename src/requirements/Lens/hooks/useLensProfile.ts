import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { LENS_API_URL } from "./useLensProfiles"

const fetchLensProfile = ([endpoint, handle]) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
      profiles(request: { where: { handles: ["lens/${handle}"] } }) {
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
  }).then((res) => {
    const foundProfile = res?.data?.profiles?.items?.[0]
    if (!foundProfile) return null

    return {
      handle: foundProfile.handle.localName,
      img: foundProfile.metadata?.picture?.optimized?.uri,
    }
  })

const useLensProfile = (handle: string) =>
  useSWRImmutable<{
    handle: string
    img?: string
  }>(handle ? [LENS_API_URL, handle.replace(".lens", "")] : null, fetchLensProfile)

export default useLensProfile
