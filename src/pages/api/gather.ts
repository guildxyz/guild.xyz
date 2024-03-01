import { NextApiRequest, NextApiResponse } from "next"

const BASE_CHECK_URL = `https://gather.town/api/getEmailGuestlist`

const checkSpaceAccess = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const url = `${BASE_CHECK_URL}?apiKey=${req.query?.apiKey}&spaceId=${req.query?.spaceId}`
    const response = await fetch(url)

    if (response.status === 200) {
      const data = await response.json()
      res.status(200).json(data)
    } else {
      const errorMessage = await response.text()
      const errorType =
        errorMessage === "Unable to access your account." ? "APIKeyError" : "Error"
      res.status(500).json({ type: errorType })
    }
  } catch (error) {
    res.status(500).json({ type: "Error" })
  }
}

export default checkSpaceAccess
