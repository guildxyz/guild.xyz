import { NextApiHandler } from "next"
import fetcher from "utils/fetcher"

const fetch51Songs = (id: string, after: string) =>
  fetcher("https://api.sound.xyz/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sound-Client-Key": process.env.SOUND_API_KEY,
    },
    body: {
      query: `{
        artist(id: "${id}"){
          mintedReleasesPaginated(pagination: {first: 51, sort: DESC, after : "${after}"}){
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
  }).then((res) => res?.data?.artist?.mintedReleasesPaginated)

const handler: NextApiHandler = async (req, res) => {
  const id = req.query.id.toString()

  const fetchSongs = async () => {
    if (id != "") {
      let songs = []
      let after = ""
      const firstFetch = await fetch51Songs(id, after)
      let newSongs
      songs = songs.concat(firstFetch?.edges)
      after = firstFetch?.pageInfo?.endCursor

      do {
        newSongs = fetch51Songs(id, after)
        songs = songs.concat(newSongs?.edges)
        after = newSongs?.data?.artist?.mintedReleasesPaginated?.pageInfo?.endCursor
      } while (newSongs?.length > 0)

      return songs.filter((data) => data != null)
    }
  }

  const soundSongs = await fetchSongs().then((data) =>
    data?.map((info) => [
      {
        title: info?.node?.title,
        image: info?.node?.coverImage?.url ?? "/requirementLogos/sound.png",
      },
    ])
  )

  res.status(200).json(soundSongs)
}

export default handler
