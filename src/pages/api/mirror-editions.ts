export default async function handler(_, res) {
  const dataJSON = await fetch(process.env.MIRROR_API)
  const data = await dataJSON.json()

  res.json(Array.isArray(data) ? data : [])
}
