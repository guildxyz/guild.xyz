import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const balancyParams =
    typeof req.query.balancyParams === "string"
      ? [req.query.balancyParams]
      : req.query.balancyParams ?? []

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BALANCY_API}/api/${balancyParams.join("/")}`,
    {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.BALANCY_TOKEN,
      },
    }
  ).catch(() => {
    res.status(500).json({ message: "Failed to fetch holders" })
  })
  if (!response) return

  try {
    const body = await response.json()
    res.status(response.status).json(body)
  } catch (error) {
    res.status(response.status).json(error)
  }
}

export default handler
