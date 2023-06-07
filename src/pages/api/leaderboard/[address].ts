import { kv } from "@vercel/kv"
import { db } from "@vercel/postgres"
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

  if (typeof rank !== "number") {
    res.status(404).json({ error: "Couldn't find user in the leaderboard" })
    return
  }

  const position = rank + 1

  // TODO: better type
  const kvKey = `guildPins:${addressAsString}`
  const userLeaderboardData: any = await kv.get(kvKey)

  if (!userLeaderboardData || userLeaderboardData.expiryDate < Date.now()) {
    // fetch from psql, insert into redis, return the data
    const client = await db.connect()
    const { rows } = await client.sql`select
      gm.id,
      gm.address,
      gm.score,
      array_agg(
          jsonb_build_object(
              'tokenId', gp.token_id,
              'chainId', gp.chain_id,
              'tokenUri', gp.token_uri,
              'rank', gp.rank
          )
      ) as pins
    from
      guild_pin_minters gm
    left join
      guild_pins gp on gm.id = gp.minter
    where
      gm.address = ${addressAsString}
    group by
      gm.id, gm.address`

    const newUserLeaderboardData = rows?.[0]

    if (!newUserLeaderboardData) {
      res.status(404).json({ error: "Couldn't find user" })
      return
    }

    // Save data to Vercel KV
    await kv.set(kvKey, {
      address: newUserLeaderboardData.address,
      score: newUserLeaderboardData.score,
      pins: newUserLeaderboardData.pins,
    })

    // Cache the response for 5 minutes
    res.setHeader("Cache-Control", "s-maxage=300")
    res.json({ userLeaderboardData: newUserLeaderboardData, position })
    return
  }

  // Cache the response for 5 minutes
  res.setHeader("Cache-Control", "s-maxage=300")
  res.json({ userLeaderboardData, position })
}

export default handler
