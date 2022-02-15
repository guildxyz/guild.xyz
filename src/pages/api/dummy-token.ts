import { NextApiHandler } from "next"

// TODO: delete this file once we are calling the real endpoint

const handler: NextApiHandler = (req, res) => {
  res
    .status(200)
    .setHeader(
      "set-cookie",
      `sessionToken=abcdefgh12345; Max-Age=${20}; Path=/; HttpOnly`
    )
    .json({ message: "Success" })
}

export default handler
