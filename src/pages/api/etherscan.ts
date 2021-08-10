/**
 * Having this server endpoint instead of just fetching the URL from the client to
 * hide our Etherscan api key
 */

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `${req.body.url}&apikey=${process.env.ETHERSCAN_API_KEY}`
  try {
    const response = await fetch(url)
    res.status(response.status).json(response.body)
  } catch (_) {
    res.status(404).send("Unable to connect to Etherscan")
  }
}

export default handler
