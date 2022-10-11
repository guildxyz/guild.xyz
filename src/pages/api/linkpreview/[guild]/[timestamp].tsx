import { NextApiRequest, NextApiResponse } from "next"

export const config = {
  runtime: "experimental-edge",
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO...
  return res.json({ something: "anything" })
}

export default handler
