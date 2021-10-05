export default async function handler(_, res) {
  const dataJSON = await fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/metadata/info`)
  const data = await dataJSON.json()

  res.json(Array.isArray(data) ? data : [])
}
