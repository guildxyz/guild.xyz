export default async function handler(_, res) {
  const dataJSON = await fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/metadata`)
  const data = await dataJSON.json()

  res.json(data || [])
}
