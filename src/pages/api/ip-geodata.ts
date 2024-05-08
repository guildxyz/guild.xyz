import { NextApiHandler } from "next"

export type IpGeodata = { country: any }

const handler: NextApiHandler<IpGeodata> = async (request, response) => {
  response.json({
    country: request.headers["x-vercel-ip-country"],
  })
}

export default handler
