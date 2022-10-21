import { NextApiHandler } from "next"

type Query = {
  search: string
  type: string
  token: string
}

const handler: NextApiHandler = async (req, res) => {
  const { search, type, token } = req.query as Query

  if (!token) {
    res.status(400).json({ message: "Missing query parameter: token" })
    return
  }
  if (!type) {
    res.status(400).json({ message: "Missing query parameter: type" })
    return
  }
  if (!search) {
    res.status(400).json({ message: "Missing query parameter: search" })
    return
  }

  // prettier-ignore
  const url = `https://api.spotify.com/v1/search?limit=50&q=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}`

  const accessToken = token //readNacl(token)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  const body = await response.json()

  if (!response.ok) {
    res.status(response.status).json(body)
    return
  }

  res.status(200).json(body)
}

export default handler
