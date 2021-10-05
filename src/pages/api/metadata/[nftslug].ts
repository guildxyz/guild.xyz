export default async function handler(req, res) {
  const { nftslug } = req.query

  const dataJSON = await fetch(
    `${process.env.NEXT_PUBLIC_GUILD_API}/metadata/${nftslug}`
  )
  const data = await dataJSON.json()

  res.json(Array.isArray(data) ? data : [])
}
