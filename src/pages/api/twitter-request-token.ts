import { createHmac, randomBytes } from "crypto"
import { NextApiHandler } from "next"

const CONSUMER_KEY = process.env.TWITTER_API_KEY
const CONSUMER_SECRET = process.env.TWITTER_API_SECRET
const SIGNATURE_METHOD = "HMAC-SHA1"
const OAUTH_VERSION = "1.0"
const DEFAULT_CALLBACK_URL = "https://guild.xyz/oauth"
const BASE_URL = "https://api.twitter.com/oauth/request_token"
const KEY = `${encodeURIComponent(CONSUMER_SECRET)}&`
const PARSE_FAIL_ERROR_MSG = "Unexpected data received from Twitter"

// /oauth_token=(.*?)&oauth_token_secret=(.*?)&oauth_callback_confirmed=true/
const parseV1Response = (response: string) => {
  try {
    const [, tokenStripped] = response.split("oauth_token=")
    const [oauthToken, secretStripped] = tokenStripped.split("&oauth_token_secret=")
    const [oauthTokenSecret] = secretStripped.split("&oauth_callback_confirmed=true")

    if (!!oauthToken && !!oauthTokenSecret) {
      return { oauthToken, oauthTokenSecret }
    }
  } catch (error) {
    throw Error(PARSE_FAIL_ERROR_MSG)
  }

  throw Error(PARSE_FAIL_ERROR_MSG)
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method?.toLowerCase() !== "get") {
    res
      .status(400)
      .json({ message: "Only GET requests are served by this endpoints" })
    return
  }

  const { callbackUrl } = req.query
  const oauthCallback = callbackUrl?.toString() ?? DEFAULT_CALLBACK_URL

  const nonce = randomBytes(32).toString("base64")
  const timestamp = Math.floor(Date.now() / 1000).toString()

  const url = `${BASE_URL}?oauth_callback=${encodeURIComponent(oauthCallback)}`

  const params = new URLSearchParams({
    oauth_callback: oauthCallback,
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: SIGNATURE_METHOD,
    oauth_timestamp: timestamp,
    oauth_version: OAUTH_VERSION,
  }).toString()

  const signatureInput = `POST&${encodeURIComponent(BASE_URL)}&${encodeURIComponent(
    params
  )}`

  const signature = createHmac("sha1", KEY)
    .update(signatureInput)
    .digest()
    .toString("base64")

  const authHeaderValue = `OAuth oauth_consumer_key="${encodeURIComponent(
    CONSUMER_KEY
  )}", oauth_nonce="${encodeURIComponent(
    nonce
  )}", oauth_signature="${encodeURIComponent(
    signature
  )}", oauth_signature_method="${SIGNATURE_METHOD}", oauth_timestamp="${timestamp}", oauth_version="${OAUTH_VERSION}"`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeaderValue,
    },
  })

  if (!response.ok) {
    res.status(400).json({ message: "Failed to generate Twitter request token" })
    return
  }

  const responseText = await response.text()

  try {
    const { oauthToken } = parseV1Response(responseText)
    res.status(200).json(oauthToken)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default handler
