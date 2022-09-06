import axios from "axios"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const { username, placeholder } = req.query

  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`,
      {
        responseType: "json",
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
        },
      }
    )

    if (response.status >= 200 && response.status < 300) {
      const avatarUrl = !placeholder
        ? response.data.data.profile_image_url.replace("_normal", "_400x400")
        : response.data.data.profile_image_url

      const imageResponse = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
      })

      const contentType = imageResponse.headers["content-type"] || "image/png"

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": Buffer.byteLength(imageResponse.data as ArrayBuffer),
      })
      res.end(imageResponse.data)
    } else {
      throw new Error("User not found")
    }
  } catch (error) {
    res.status(500).json({ message: error?.message || "Unknown error" })
  }
}

export default handler
