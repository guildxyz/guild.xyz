import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type SongsSound = {
  artists: {
    edges: {
      node: {
        name: string
        soundHandle: string
        bannerImage: {
          url: string
        }
      }
    }
    pageInfo: { endCursor: string }
  }
}

const fetch1000Songs = (endpoint: string, after: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sound-Client-Key": "0326835a-0abe-4b77-8f8a-cc7bc7047ce0",
    },
    body: {
      query: `{
        artists(pagination: {first: 1000, after: ${after}}) {
          edges {
            node {
              name
              soundHandle
              bannerImage {
                url
              }
            }
          }
          pageInfo{
            startCursor
            endCursor
          }
        }
      }`,
    },
  })

const fetchSongs = async (endpoint: string) => {
  let artists = []
  let after = ""
  const firstFetch = await fetch1000Songs(endpoint, after)
  let newArtist = firstFetch
  after = await firstFetch.then((e) => e.data.artists.pageInfo.endCursor)

  do {
    newArtist = await fetch1000Songs(endpoint, after).then(
      (e) => e.data.artists.edges.node
    )
    artists = artists.concat(newArtist)
    after = await newArtist.data.artists.pageInfo.endCursor
  } while (newArtist?.length > 0)

  return artists
}

const useSoundSongs = () =>
  useSWRImmutable<SongsSound[]>(`https://api.sound.xyz/graphql`, fetchSongs)

export default useSoundSongs
