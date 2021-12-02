import type { NextApiRequest, NextApiResponse } from "next"
import fetcher from "utils/fetcher"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data } = req.body
  try {
    const hashed = await fetcher(`${process.env.DC_RUNNER_API}/hashUserId/${data}`)
    res.status(200).json({ hashed })
  } catch {
    res.status(400).json({ error: "Failed to hash data" })
  }
}

export default handler
