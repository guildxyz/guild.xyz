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
      fetch(
        `/api/twitter-request-token?callbackUrl=${encodeURIComponent(callbackUrl)}`
      ).then((res) => res.json().then((oauth_token) => ({ oauth_token } as any)))
  )

export default useLegacyTwitterAuth
