import { kv } from "@vercel/kv"
import { NextApiRequest, NextApiResponse } from "next"

export const NON_PURCHASABLE_ASSETS_KV_KEY = "nonPurchasableTokens"

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, POST")
    response.status(405).json({ error: `Method ${request.method} is not allowed` })
    return
  }

  const nonPurchasableTokens = await kv.keys(`${NON_PURCHASABLE_ASSETS_KV_KEY}:*`)

  const res: Record<number, string[]> = {}

  for (const row of nonPurchasableTokens) {
    const [, chainId, address] = row.split(":")

    if (!res[chainId]) res[chainId] = []

    res[chainId].push(address)
  }

  response.status(200).json(res)
}

export default handler
