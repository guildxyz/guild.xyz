import { NextApiRequest, NextApiResponse } from "next"
import { GalaxyCampaign } from "types"
import fetcher from "utils/fetcher"

type GalaxyGraphResponse = {
  list: Array<GalaxyCampaign>
  pageInfo: {
    hasNextPage: boolean
    endCursor: string
  }
}

const fetch1000Campaigns = async (after: string): Promise<GalaxyGraphResponse> =>
  fetcher("https://graphigo.prd.galaxy.eco/query", {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
      campaigns(input:{first: 1000, after: "${after}"}) {
        list {
          id
          name
          thumbnail
          chain
        },
        pageInfo {
          hasNextPage,
          endCursor
        }
      }
    }`,
    },
  }).then((res) => res.data?.campaigns)

const fetchCampaigns = async () => {
  let shouldFetch = true
  let after = "0"
  let campaigns = []

  do {
    const newCampaignsRes = await fetch1000Campaigns(after)

    if (newCampaignsRes.list) {
      campaigns = campaigns.concat(newCampaignsRes.list)
      after = newCampaignsRes.pageInfo.endCursor
      shouldFetch = newCampaignsRes.pageInfo.hasNextPage
    } else {
      shouldFetch = false
    }
  } while (shouldFetch)

  return campaigns
}

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const campaigns = await fetchCampaigns()
  res.json(campaigns)
}

export default handler
