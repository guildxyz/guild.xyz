import { NextApiRequest, NextApiResponse } from "next"
import fetcher from "utils/fetcher"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(501).json({ error: "Not implemented" })

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { event_id, requested_codes, secret_code, redeem_type } = req.body

  if (
    typeof event_id !== "number" ||
    requested_codes <= 0 ||
    !secret_code ||
    !redeem_type
  )
    return res.status(400).json({ error: "Missing parameter(s)" })

  let redeemRequestsRes

  try {
    redeemRequestsRes = await fetcher("https://api.poap.tech/redeem-requests", {
      headers: {
        Authorization: `Bearer ${process.env.POAP_AUTH_TOKEN}`,
        "X-API-Key": process.env.POAP_X_API_KEY,
      },
      body: {
        event_id,
        requested_codes,
        secret_code,
        redeem_type,
      },
    })
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message })
  }

  res.json(redeemRequestsRes)
}

export default handler
