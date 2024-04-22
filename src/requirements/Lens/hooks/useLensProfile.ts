import REQUIREMENTS from "requirements"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { LENS_API_URL, LensProfile } from "./useLensProfiles"

const fetchLensProfile = ([endpoint, profileId]): Promise<LensProfile> =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
      profiles(request: { where: { profileIds: ["${profileId}"] } }) {
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
  }).then((res) => res?.data?.profiles?.items?.[0])

const useLensProfile = (id: string) => {
  const { data, ...swrResponse } = useSWRImmutable<LensProfile>(
    typeof id === "string" && id.startsWith("0x") ? [LENS_API_URL, id] : null,
    fetchLensProfile
  )

  return {
    ...swrResponse,
    data: !!data
      ? {
          label: `${data.handle.localName}.lens`,
          value: data.id,
          img:
            data.metadata.picture.optimized.uri ??
            (REQUIREMENTS.LENS.icon as string),
        }
      : undefined,
  }
}

export default useLensProfile
