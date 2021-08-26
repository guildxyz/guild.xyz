import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { urlName } = req.query

  if (!urlName) {
    return res.status(401).json({ message: "Invalid request" })
  }

  res.setPreviewData(
    {},
    {
      maxAge: 30, // Preview cookie expires in 30s
    }
  )

  const cookies = res.getHeader("set-cookie")

  /* if (req.query.levelsPage) {
    res.redirect(`/${community.urlName}/community`)
  } else {
    res.redirect(`/${community.urlName}`)
  } */
  res.status(200).send(cookies)
}

export default handler
