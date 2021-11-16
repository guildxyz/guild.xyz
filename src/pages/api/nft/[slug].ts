export default async function handler(req, res) {
  const { slug } = req.query

  const dataJSON = await fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/nft/${slug}`)
  const data = await dataJSON.json()

  res.json(data || {})
}
