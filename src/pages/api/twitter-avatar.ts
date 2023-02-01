import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const { username, placeholder } = req.query

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
        },
      }
    )

    if (response.ok) {
      const userData = await response.json()

      res.redirect(
        !placeholder
          ? userData.data.profile_image_url.replace("_normal", "_400x400")
          : userData.data.profile_image_url
      )
    } else {
      throw new Error("User not found")
    }
  } catch (error) {
    res.redirect("/default_twitter_icon.png")
  }
}

export default handler
