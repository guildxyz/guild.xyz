import { NextApiRequest, NextApiResponse } from "next"
import fetcher from "utils/fetcher"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(501).json({ error: "Not implemented" })

  const { poapId, links } = req.body

  if (!poapId || !links || !Array.isArray(links))
    return res.status(400).json({ error: "Missing or invalid parameter(s)" })

  const hashes: string[] = links.map((link) => link.split("/").slice(-1))

  const requests = []

  const error = {
    statusCode: null,
    message: null,
  }

  hashes.forEach((hash) => {
    requests.push(
      fetcher(`https://api.poap.tech/actions/claim-qr?qr_hash=${hash}`, {
        headers: {
          Authorization: `Bearer ${process.env.POAP_AUTH_TOKEN}`,
          "X-API-Key": process.env.POAP_X_API_KEY,
        },
      })
        .then((resp) => resp)
        .catch((err) => {
          if (!error.message) {
            const { statusCode, error: title, message } = err
            error.statusCode = statusCode ?? 500
            error.message =
              title && message
                ? `${title} - ${message}`
                : "Couldn't validate mint links."
          }
        })
    )
  })

  const claimQrResponses = await Promise.all(requests)

  if (error.statusCode && error.message)
    return res.status(error.statusCode).json({ error: error.message })

  const codesAreValid = claimQrResponses.every(
    (poapInfo) => poapInfo.event_id === poapId
  )

  if (!codesAreValid)
    return res.json({
      validated: false,
    })

  res.json({
    validated: true,
  })
}

export default handler
