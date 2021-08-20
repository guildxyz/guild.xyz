import { createHmac } from "crypto"
import type { NextApiRequest, NextApiResponse } from "next"

const hmac = createHmac(process.env.HMAC_ALGORITHM, process.env.HMAC_SECRET)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data } = req.body
  try {
    hmac.update(data)
    const hashed = hmac.digest("base64")
    res.status(200).json({ hashed })
  } catch {
    res.status(400).json({ error: "Failed to hash data" })
  }
}

export default handler
