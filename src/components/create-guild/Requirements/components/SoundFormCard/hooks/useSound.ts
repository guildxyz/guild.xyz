import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchArtists = (endpoint: string, searchQuery: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sound-Client-Key": "0326835a-0abe-4b77-8f8a-cc7bc7047ce0",
    },
    body: {
      query: `{
        search(input: {limit: 20, text: "${searchQuery}"}) {
          artists {
            id
            name
            soundHandle
            user {
              avatar{
                url
              }
            }
          }
        }
      }`,
    },
  }).then((res) =>
    res?.data?.search?.artists?.filter(
      (artist) =>
        artist.name.includes(searchQuery) || artist.soundHandle.includes(searchQuery)
    )
  )

const useSoundArtists = (searchQuery: string) => {
  const { data, isValidating } = useSWRImmutable(
    searchQuery?.length > 0 ? ["https://api.sound.xyz/graphql", searchQuery] : null,
    fetchArtists
  )

  return {
    artists: data?.map((info) => [
      {
        name: info?.name,
        soundHandle: info?.soundHandle,
        image: info?.user?.avatar?.url ?? "/requirementLogos/sound.png",
        id: info?.id,
      },
    ]),
    isLoading: isValidating,
  }
}

type Songs = {
  mintedReleasesPaginated: {
    edges: {
      node: {
        title: string
      }
    }
    pageInfo: {
      startCursor: string
      endCursor: string
    }
  }
}

const fetch51Songs = (endpoint: string, id: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sound-Client-Key": "0326835a-0abe-4b77-8f8a-cc7bc7047ce0",
    },
    body: {
      query: `{
        artist(id: "${id}"){
          mintedReleasesPaginated(pagination: {first: 51, sort: DESC}){
            edges{
              node {
                title
                coverImage{
                  url
                }
              }
            }
            pageInfo {
      	      startCursor
              endCursor
            }
          }
        }
      }`,
    },
  }).then((res) => res?.data?.artist)

// const fetchSongs = async (endpoint: string, id: string) => {
//   let songs = []
//   let after = ""
//   const firstFetch = await fetch51Songs(endpoint, after, id)
//   let newSongs
//   songs = songs.concat(firstFetch)
//   // after = firstFetch?.pageInfo?.endCursor

//   do {
//     newSongs = fetch51Songs(endpoint, after, id)
//     songs = songs.concat(newSongs)
//     after = newSongs?.data?.artist?.mintedReleasesPaginated?.pageInfo?.endCursor
//   } while (newSongs?.length > 0)

//   return songs
// }

// const useSoundSongs = (id: string) =>
//   useSWRImmutable(
//     id?.length > 0 ? ["https://api.sound.xyz/graphql", id] : null,
//     fetch51Songs
//   )

const useSoundSongs = (id: string) => {
  const { data, isValidating } = useSWRImmutable(
    id?.length > 0 ? ["https://api.sound.xyz/graphql", id] : null,
    fetch51Songs
  )

  return {
    songs: data?.mintedReleasesPaginated?.edges?.map((info) => [
      {
        title: info?.node?.title,
        image: info?.node?.coverImage?.url ?? "/requirementLogos/sound.png",
      },
    ]),
    songLoading: isValidating,
  }
}
export { useSoundArtists, useSoundSongs, fetch51Songs }
