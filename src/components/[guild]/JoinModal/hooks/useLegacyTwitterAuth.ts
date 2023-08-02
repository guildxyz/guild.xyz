import fetcher from "utils/fetcher"
import useOauthPopupWindow from "./useOauthPopupWindow"

const useLegacyTwitterAuth = () =>
  useOauthPopupWindow(
    "TWITTER_V1",
    "https://api.twitter.com/oauth/authorize",
    {
      oauth_callback: `${window.origin}/oauth`,
      x_auth_access_type: "read",
    } as any,
    (callbackUrl) =>
      fetcher(
        `/api/twitter-request-token?callbackUrl=${encodeURIComponent(callbackUrl)}`
      ).then((oauth_token) => ({ oauth_token } as any))
  )

export default useLegacyTwitterAuth
