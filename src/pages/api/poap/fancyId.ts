import FormData from "form-data"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") return res.status(501).json({ error: "Not implemented" })

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
      continue
    }

    formData.append(key, req.body[key])
  }

  const data = await fetch(`https://api.poap.tech/events/${fancyId}`, {
    method: "PUT",
    body: formData as any,
    headers: {
      Accept: "application/json",
      "X-API-Key": process.env.POAP_X_API_KEY,
    },
  })
    .then((poapApiResponse) => poapApiResponse.json())
    .catch((err) => console.log("PUT /poap/fancyId error", err))

  if (data?.message) return res.status(500).json({ error: data.message })

  res.json(data)
}

export default handler
