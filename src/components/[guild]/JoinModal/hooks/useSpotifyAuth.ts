import useOauthPopupWindow from "./useOauthPopupWindow"

const useSpotifyAuth = (
  scope = "user-read-private user-library-read user-follow-read user-top-read playlist-read-private"
) =>
  useOauthPopupWindow("https://accounts.spotify.com/authorize", {
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    scope,
  })

export default useSpotifyAuth
