import FormData from "form-data"
import multer from "multer"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const handler = nextConnect({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({ error: `${error.message}` })
  },
})

handler.use(upload.single("image"))

handler.post(async (req: NextApiRequest & { file: any }, res: NextApiResponse) => {
  const formData = new FormData()
  for (const key in req.body) {
    if (key === "image") continue

    // Converting date formats from YYYY-MM-DD to MM-DD-YYYY
    if (
      (key === "start_date" || key === "end_date" || key === "expiry_date") &&
      req.body[key]?.length > 0
    ) {
      const [y, m, d] = req.body[key].split("-")
      formData.append(key, `${m}-${d}-${y}`)
      continue
    }

    if (
      key === "event_url" &&
      req.body[key].length > 0 &&
      !req.body[key].startsWith("http")
    ) {
      formData.append(key, `https://${req.body[key]}`)
      continue
    }

    formData.append(key, req.body[key])
  }

  const fileType = req.file?.mimetype?.replace("image/", "") ?? "png"
  formData.append("image", req.file.buffer, `image.${fileType}`)

  const data = await fetch("https://api.poap.tech/events", {
    method: "POST",
    body: formData as any,
    headers: {
      Accept: "application/json",
      "X-API-Key": process.env.POAP_X_API_KEY,
    },
  })
    .then((poapApiResponse) => poapApiResponse.json())
    .catch((err) => console.log("POST /poap error", err))

  if (data?.message) return res.status(500).json({ error: data.message })

  res.json(data)
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
