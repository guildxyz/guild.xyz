import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { verifyMessage } from "@ethersproject/wallet"
import { kv } from "@vercel/kv"
import { sql } from "@vercel/postgres"
import { Chain, RPC } from "connectors"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

export type MysteryBoxResponse =
  | { message: string; error?: never }
  | { error: string; message?: never }

export const MYSTERY_BOX_MESSAGE_TO_SIGN =
  "Please sign this message in order to claim your prize"
export const MYSTERY_BOX_NFT: { address: string; chain: Chain } = {
  address: "0x295f799Be8ba015Ca9BE5EfFbC5CaeC985cCA11a",
  chain: "POLYGON",
}
const DUPLICATE_KEY_ERROR = "23505"
export const MYSTERY_BOX_CLAIMERS_KV_KEY = "mysteryBoxClaimers"

const handler: NextApiHandler<MysteryBoxResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse<MysteryBoxResponse>
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    res.status(405).json({ error: `Method ${req.method} is not allowed` })
    return
  }

  const timestamp = Date.now()
  const claimEnd = new Date("2023-10-01").getTime()
  if (timestamp > claimEnd)
    return res.status(400).json({ error: "Claim period ended" })

  const {
    signedMessage,
    country,
    stateProvinceRegion,
    zipCode,
    city,
    street,
    houseNumber,
    name,
    phone,
  } = req.body

  if (!signedMessage) return res.status(403).json({ error: "Unauthenticated" })

  if (
    !country ||
    !stateProvinceRegion ||
    !zipCode ||
    !city ||
    !street ||
    !houseNumber ||
    !name
  )
    return res.status(400).json({ error: "Invalid shipping address" })

  const walletAddress = verifyMessage(
    MYSTERY_BOX_MESSAGE_TO_SIGN,
    signedMessage
  ).toLowerCase()

  let balanceOf: BigNumber

  try {
    const provider = new JsonRpcProvider(RPC[MYSTERY_BOX_NFT.chain].rpcUrls[0])
    const nftContract = new Contract(
      MYSTERY_BOX_NFT.address,
      ["function balanceOf(address owner) view returns (uint)"],
      provider
    )
    balanceOf = await nftContract.balanceOf(walletAddress)
  } catch {
    return res.status(500).json({ error: "Couldn't check eligibility" })
  }

  if (balanceOf.lt(1))
    return res
      .status(403)
      .json({ error: "You are not eligible to claim a Guild Pin Mystery Box" })

  const shippingDetails = {
    country,
    stateProvinceRegion,
    zipCode,
    city,
    street,
    houseNumber,
    name,
    phone,
  }
  try {
    await sql`INSERT INTO mystery_box_claims (wallet_address, shipping_details) VALUES (${walletAddress}, ${JSON.stringify(
      shippingDetails
    )});`
    await kv.sadd(MYSTERY_BOX_CLAIMERS_KV_KEY, walletAddress)
  } catch (dbError) {
    return res.status(500).json({
      error:
        dbError.code === DUPLICATE_KEY_ERROR
          ? "You've already submitted your shipping information"
          : "Database error",
    })
  }

  res.json({ message: "Succesfully submitted shipping data" })
}

export default handler
