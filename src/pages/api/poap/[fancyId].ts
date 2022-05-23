import fetcher from "utils/fetcher"

export default async function handler(req, res) {
  const fancyId = req.query.fancyId

  const data = await fetcher(`https://api.poap.tech/events/${fancyId}`, {
    headers: {
      "X-API-Key": process.env.POAP_X_API_KEY,
    },
  })

  res.json(data)
}
