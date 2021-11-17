export default async function handler(req, res) {
  const { invite } = req.query

  const dataJSON = await fetch(
    `${process.env.NEXT_PUBLIC_API}/guild/discordCategories/${invite}`
  )
  const data = await dataJSON.json()

  res.status(dataJSON.status).json(data || {})
}
