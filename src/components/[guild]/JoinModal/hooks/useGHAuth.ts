import useOauthPopupWindow from "./useOauthPopupWindow"

const useGHAuth = (
  scope: "repo,read:user" | "repo:invite,read:user" = "repo:invite,read:user"
) =>
  useOauthPopupWindow("https://github.com/login/oauth/authorize", {
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    scope,
  })

export default useGHAuth
