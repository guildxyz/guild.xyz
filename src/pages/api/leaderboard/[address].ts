import { kv } from "@vercel/kv"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ error: `Method ${req.method} is not allowed` })
    return
  }

  const { address } = req.query
  const addressAsString = address?.toString()?.toLowerCase()

  if (!ADDRESS_REGEX.test(addressAsString)) {
    res.status(400).json({ error: "Invalid address" })
    return
  }

  const rank = await kv.zrevrank("guildPinsLeaderboard", addressAsString)

  const userLeaderboardData = await kv.get(`guildPins:${addressAsString}`)

  res.json({ userLeaderboardData, position: rank + 1 })
}

export default handler
