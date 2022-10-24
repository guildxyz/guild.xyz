import { NextApiRequest, NextApiResponse } from "next"

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("LOGGER HEADERS:", req.headers)
  return res.json("logger")
}

export default handler
