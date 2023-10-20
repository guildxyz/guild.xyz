import { kv } from "@vercel/kv"
import { Chains } from "chains"
import { NextApiRequest, NextApiResponse } from "next"
import { allPurchaseSupportedChains } from "utils/guildCheckout/constants"

export const NON_PURCHASABLE_ASSETS_KV_KEY = "nonPurchasableAssets"

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, POST")
    response.status(405).json({ error: `Method ${request.method} is not allowed` })
    return
  }

  const nonPurchasableAssets = {}

  for (const chain of allPurchaseSupportedChains) {
    nonPurchasableAssets[Chains[chain]] = await kv
      .lrange(`${NON_PURCHASABLE_ASSETS_KV_KEY}:${Chains[chain]}`, 0, -1)
      .catch(() => [])
  }

  response.status(200).json(nonPurchasableAssets)
}

export default handler
