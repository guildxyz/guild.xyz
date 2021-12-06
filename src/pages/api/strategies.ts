import fetcher from "utils/fetcher"

export default async function handler(_, res) {
  const data = await fetcher(`${process.env.NEXT_PUBLIC_GUILD_API}/strategies`)

  res.json(data || [])
}
