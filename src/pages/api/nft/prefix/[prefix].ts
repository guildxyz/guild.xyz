export default async function handler(req, res) {
  const { prefix } = req.query

  const dataJSON = await fetch(
    `${process.env.NEXT_PUBLIC_GUILD_API}/nft/prefix/${prefix}`
  )
  const data = await dataJSON.json()

  res.json(data || {})
}
