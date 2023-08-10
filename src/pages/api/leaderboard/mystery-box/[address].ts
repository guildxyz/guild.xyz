import { kv } from "@vercel/kv"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { MYSTERY_BOX_CLAIMERS_KV_KEY } from "."

export type MysteryBoxGetResponse =
  | { alreadyClaimed: boolean; error?: never }
  | { error: string; alreadyClaimed?: never }

const handler: NextApiHandler<MysteryBoxGetResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ error: `Method ${req.method} is not allowed` })
    return
  }

  const { address: rawAddress } = req.query

  if (!ADDRESS_REGEX.test(rawAddress?.toString()))
    return res.status(400).json({ error: "Invalid address" })

  const address = rawAddress.toString().toLowerCase()

  let alreadyClaimed = false
  try {
    const kvEntry = await kv.sismember(MYSTERY_BOX_CLAIMERS_KV_KEY, address)
    alreadyClaimed = !!kvEntry
  } catch {
    return res.status(500).json({ error: "Couldn't fetch claimer" })
  }

  res.json({
    alreadyClaimed,
  })
}

export default handler
