import { NextApiHandler } from "next"
import fetcher from "utils/fetcher"

const fetchArtists = (searchQuery: string) =>
  fetcher("https://api.sound.xyz/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sound-Client-Key": process.env.SOUND_API_KEY,
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
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.soundHandle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

const handler: NextApiHandler = async (req, res) => {
  const searchQuery = req.query.searchQuery.toString()

  const soundArtists = await fetchArtists(searchQuery).then((data) =>
    data?.map((info) => [
      {
        name: info?.name,
        soundHandle: info?.soundHandle,
        image: info?.user?.avatar?.url ?? "/requirementLogos/sound.png",
        id: info?.id,
      },
    ])
  )

  res.status(200).json(soundArtists)
}

export default handler
