import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type SongsSound = {
  id: string
  onChainId: number
  imageUri: string
  courses: {
    id: string
    title: string
    creator: {
      image: string
    }
  }[]
}

const fetchBadges = (endpoint: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        badges {
          id
          onChainId
          imageUri
          courses {
            id
            title
            creator {
              image
            }
          }
        }
      }`,
    },
  }).then((res) =>
    res?.data?.badges.filter(
      (badge) =>
        badge.courses[0] &&
        // Temporarily filtering out [Testnet] and [archive] badges so we don't get duplicate IDs here
        !badge.courses[0].title?.toLowerCase()?.includes("[testnet]") &&
        !badge.courses[0].title?.toLowerCase()?.includes("[archive]")
    )
  )

const useSoundSongs = () =>
  useSWRImmutable<SongsSound[]>(`https://api.sound.xyz/graphql`, fetchBadges)

export default useSoundSongs
