import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data } = req.body
  try {
    const response = await fetch(`${process.env.DC_RUNNER_API}/hashUserId/${data}`)
    if (!response.ok) throw new Error("Network Error")
    const hashed = await response.json()
    res.status(200).json({ hashed })
  } catch {
    res.status(400).json({ error: "Failed to hash data" })
  }
}

export default handler
