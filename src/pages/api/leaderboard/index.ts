import { kv } from "@vercel/kv"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const PAGE_SIZE = 25

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ error: `Method ${req.method} is not allowed` })
    return
  }

  const { offset } = req.query
  const offsetAsNumber = Number(offset)

  if (isNaN(offsetAsNumber) || offsetAsNumber > 75) {
    res.status(400).json({ error: "Invalid offset value" })
    return
  }

  const leaderboardTopAddressesWithOffset: string[] = await kv.zrange(
    "guildPinsLeaderboard",
    Math.max(offsetAsNumber + 1, 0),
    offsetAsNumber + PAGE_SIZE,
    {
      rev: true,
    }
  )

  const leaderboard = await kv.mget(
    ...leaderboardTopAddressesWithOffset.map((address) => `guildPins:${address}`)
  )

  // Cache the response for 5 minutes
  res.setHeader("Cache-Control", "s-maxage=300")
  res.json(leaderboard)
}

export default handler
