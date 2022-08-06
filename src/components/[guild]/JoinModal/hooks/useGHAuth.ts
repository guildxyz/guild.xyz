import useOauthPopupWindow from "./useOauthPopupWindow"

const useGHAuth = () =>
  useOauthPopupWindow("https://github.com/login/oauth/authorize", {
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    scope: "repo,read:user,user:email",
  })

export default useGHAuth
