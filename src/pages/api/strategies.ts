export default async function handler(_, res) {
  let strategies = []

  try {
    const dataJSON = await fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/strategies`)
    const data = await dataJSON.json()
    strategies = data
  } catch (_) {
    strategies = []
  }

  res.json(strategies)
}
