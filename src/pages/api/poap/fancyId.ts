import FormData from "form-data"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const fancyId = req.body.fancy_id

  if (!fancyId) return res.status(400).json({ error: "Missing parameter: fancyId" })

  const formData = new FormData()
  for (const key in req.body) {
    // Converting date formats from YYYY-MM-DD to MM-DD-YYYY
    if (
      (key === "start_date" || key === "end_date" || key === "expiry_date") &&
      req.body[key]?.length > 0
    ) {
      const [y, m, d] = req.body[key].split("-")
      formData.append(key, `${m}-${d}-${y}`)
    } else if (
      key === "event_url" &&
      req.body[key].length > 0 &&
      !req.body[key].startsWith("http")
    ) {
      formData.append(key, `https://${req.body[key]}`)
    } else {
      formData.append(key, req.body[key].toString())
    }
  }

  const textData = await fetch(`https://api.poap.tech/events/${fancyId}`, {
    method: "PUT",
    body: formData as unknown as BodyInit,
    headers: {
      Accept: "application/json",
      "X-API-Key": process.env.POAP_X_API_KEY,
    },
  }).then(async (poapApiResponse) => poapApiResponse.text())

  if (textData?.length) {
    const jsonData = await JSON.parse(textData)
    return res.status(jsonData?.statusCode).json({ error: jsonData?.message })
  }

  res.json({ success: true })
}

export default handler
