import FormData from "form-data"
import formidable from "formidable"
import fs from "fs"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: `Method ${req.method} is not allowed` })
  }

  const form = formidable({ multiples: false })
  const formData = new FormData()

  try {
    await new Promise<void>((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err)
          return
        }

        for (const [key, value] of Object.entries(fields)) {
          const valueAsString = value?.toString()?.trim() ?? ""
          if (
            (key === "start_date" || key === "end_date" || key === "expiry_date") &&
            valueAsString?.length > 0
          ) {
            const [y, m, d] = valueAsString.split("-")
            formData.append(key, `${m}-${d}-${y}`)
          } else if (
            key === "event_url" &&
            valueAsString.length > 0 &&
            !value?.toString().startsWith("http")
          ) {
            formData.append(key, `https://${valueAsString}`)
          } else {
            formData.append(key, valueAsString)
          }
        }

        const image = files?.image
        if (image) {
          const fileType = image.mimetype?.replace("image/", "") ?? "png"
          const fileInstance = fs.createReadStream(image.filepath)
          formData.append("image", fileInstance, `image.${fileType}`)
        }

        resolve()
      })
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: "Invalid form" })
  }

  const data = await fetch("https://api.poap.tech/events", {
    method: "POST",
    body: formData as unknown as BodyInit,
    headers: {
      "X-API-Key": process.env.POAP_X_API_KEY,
    },
  })
    .then((poapApiResponse) => poapApiResponse.json())
    .catch((err) => console.error("POST /poap error", err))

  if (data?.message) return res.status(500).json({ error: data.message })

  res.json(data)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
