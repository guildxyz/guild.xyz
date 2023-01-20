import { NextApiRequest, NextApiResponse } from "next"

type PinataGenerateAPIKeyResponse = {
  pinata_api_key: string
  pinata_api_secret: string
  JWT: string
}

const generateApiKey = async (res: NextApiResponse) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_API}/users/generateApiKey`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_ADMIN_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyName: Date.now().toString(),
        permissions: {
          endpoints: {
            pinning: {
              pinFileToIPFS: true,
              // pinJSONToIPFS: true,
            },
          },
        },
      }),
    }
  )

  const body: PinataGenerateAPIKeyResponse = await response.json()

  if (response.ok) {
    res.status(200).json({ key: body.pinata_api_key, jwt: body.JWT })
  } else {
    res.status(response.status).json(body)
  }
}

const revokeApiKey = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!("key" in req.body)) {
    res.status(400).json({
      message: "Missing key. Please include the API key in the body",
    })
    return
  }

  const { key: apiKey } = req.body

  if (
    [
      process.env.PINATA_ADMIN_KEY,
      process.env.PINATA_ADMIN_JWT,
      process.env.PINATA_ADMIN_SECRET,
    ].includes(apiKey)
  ) {
    res.status(400).json({ message: "Can't revoke this API key" })
    return
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_API}/users/revokeApiKey`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_ADMIN_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    }
  )

  if (response.ok) {
    res.status(200).json(null)
  } else {
    const body = await response.json()
    res.status(response.status).json(body)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") await generateApiKey(res)
    else if (req.method === "POST") await revokeApiKey(req, res)
    else {
      res.setHeader("Allow", "GET, POST")
      res.status(405).json({
        message: `Method ${req.method} is not allowed.`,
      })
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to generate Pinata JWT" })
  }
}

export default handler
