import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(501).json({ error: "Not implemented" })

  const { ddforward } = req.query
  const xForwardedForHeader = req.headers["x-forwarded-for"]?.toString()
  const contentTypeHeader = req.headers["content-type"]?.toString()

  if (!ddforward) return res.status(400).json("Bad request")

  try {
    const ddRes = await fetch(ddforward?.toString(), {
      method: "POST",
      headers: {
        "x-forwarded-for": xForwardedForHeader,
        "content-type": contentTypeHeader,
      },
      body: req.body,
    })
    const ddResJson = await ddRes?.json()

    return res.status(ddRes.status).json(ddResJson)
  } catch (e) {
    return res.status(500).json({})
  }
}

export default handler
