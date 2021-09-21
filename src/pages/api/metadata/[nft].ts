export default async function handler(req, res) {
  const { nft } = req.query

  const dataJSON = await fetch(
    `${process.env.NEXT_PUBLIC_GUILD_API}/metadata/${nft}`
  )
  const data = await dataJSON.json()

  res.json(data.metadata || {})
}
