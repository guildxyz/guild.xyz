import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

const BASE_CHECK_URL = `https://gather.town/api/getEmailGuestlist`

const checkSpaceAccess = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get(BASE_CHECK_URL, {
      params: req.query,
    })
    res.status(200).json(response.data)
  } catch (error) {
    const errorType =
      error.response?.data === "Unable to access your account."
        ? "APIKeyError"
        : "Error"
    res.status(error.response?.status || 500).json({ type: errorType })
  }
}

export default checkSpaceAccess
