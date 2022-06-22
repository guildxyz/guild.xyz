import { NextApiRequest, NextApiResponse } from "next"
import fetcher from "utils/fetcher"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.id) return res.status(404).json(null)

  const campaignRes = await fetcher("https://graphigo.prd.galaxy.eco/query", {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
      campaign(id: "${req.query.id}") {
        id
        numberID
        name
        thumbnail
        chain
      }
    }`,
    },
  })

  if (campaignRes.errors) {
    return res.status(500).json({ errors: campaignRes.errors })
  }

  res.json(campaignRes.data.campaign)
}

export default handler
