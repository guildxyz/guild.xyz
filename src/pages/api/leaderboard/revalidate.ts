import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ error: `Method ${req.method} is not allowed` })
    return
  }

  if (req.query.secret !== process.env.LEADERBOARD_REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    await res.revalidate("/leaderboard")
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send("Error revalidating")
  }
}

export default handler
