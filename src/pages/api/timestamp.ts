import { NextApiHandler } from "next"

const handler: NextApiHandler = (_req, res) => {
  res.status(200).json(Date.now().toString())
}

export default handler
