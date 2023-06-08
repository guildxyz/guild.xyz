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
  const score = await kv.zscore("guildPinsLeaderboard", addressAsString)

  if (typeof rank !== "number" || typeof score !== "number") {
    res.status(404).json({ error: "Couldn't find user in the leaderboard" })
    return
  }

  const position = rank + 1

  // Cache the response for 5 minutes
  res.setHeader("Cache-Control", "s-maxage=300")
  res.json({ score, position })
}

export default handler
