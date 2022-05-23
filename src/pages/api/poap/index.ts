import fetcher from "utils/fetcher"

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(_, res) {
  let poaps = []

  let offset = 0
  let newPoaps = []

  do {
    newPoaps = await fetcher(
      `https://api.poap.tech/paginated-events?limit=0&offset=${offset}`,
      {
        headers: {
          "X-API-Key": process.env.POAP_X_API_KEY,
        },
      }
    ).then((poapRes) =>
      poapRes.items?.map((poap) => ({
        id: poap.id,
        fancy_id: poap.fancy_id,
        name: poap.name,
        image_url: poap.image_url,
      }))
    )
    poaps = poaps.concat(newPoaps)
    offset += 1000
  } while (newPoaps?.length > 0)

  res.json(Array.isArray(poaps) ? poaps : [])
}
