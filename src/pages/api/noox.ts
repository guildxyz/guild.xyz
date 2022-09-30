import { NextApiHandler } from "next"
import fetcher from "utils/fetcher"

const getNooxBadges = (size: number, page: string) =>
  fetcher(
    `https://api.noox.world/v1/badges?size=${size}` +
      (page !== "0" ? `&paginationToken=${page}` : ""),
    { headers: { "x-api-key": process.env.NOOX_KEY } }
  )

const getAllNooxBadges = async () => {
  const nooxBadges = []
  let info = { hasMore: true, nextToken: "0" }

  while (info.hasMore) {
    const { badges, meta } = await getNooxBadges(100, info.nextToken)
    info = meta
    badges.map((badge) => {
      nooxBadges.push(badge)
    })
  }

  return nooxBadges
}

const handler: NextApiHandler = async (_req, res) => {
  const nooxBadges = await getAllNooxBadges()
  res.status(200).json(nooxBadges)
}

export default handler
