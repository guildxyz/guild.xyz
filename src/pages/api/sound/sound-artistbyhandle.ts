import { NextApiHandler } from "next"
import fetcher from "utils/fetcher"

const fetchArtists = (artistId: string) =>
  fetcher("https://api.sound.xyz/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sound-Client-Key": process.env.SOUND_API_KEY,
    },
    body: {
      query: `{
        artistByHandle(soundHandle: "${artistId}"){
  	      name
          id
          user {
              avatar{
                url
              }
            }
	      }
      }`,
    },
  }).then((res) => res.data.artistByHandle)

const handler: NextApiHandler = async (req, res) => {
  const soundHandle = req.query.soundHandle.toString()

  const soundArtists = await fetchArtists(soundHandle).then((artist) => ({
    name: artist?.name,
    image: artist?.user?.avatar?.url,
    id: artist?.id,
  }))

  res.status(200).json(soundArtists)
}

export default handler
