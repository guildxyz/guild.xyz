import fetcher from "utils/fetcher"

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(_, res) {
  const data = await fetcher(process.env.MIRROR_API)

  res.json(Array.isArray(data) ? data : [])
}
