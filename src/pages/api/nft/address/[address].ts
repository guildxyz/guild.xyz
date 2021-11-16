export default async function handler(req, res) {
  const { address } = req.query

  const dataJSON = await fetch(
    `${process.env.NEXT_PUBLIC_GUILD_API}/nft/address/${address}`
  )
  const data = await dataJSON.json()

  res.json(data || {})
}
