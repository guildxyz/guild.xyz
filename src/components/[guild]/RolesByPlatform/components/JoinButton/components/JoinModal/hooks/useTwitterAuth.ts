import useOauthPopupWindow from "./useOauthPopupWindow"

const useTwitterAuth = () =>
  useOauthPopupWindow("https://twitter.com/i/oauth2/authorize", {
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    scope: "tweet.read users.read follows.read offline.access",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  })

export default useTwitterAuth
