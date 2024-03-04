import useOauthPopupWindow from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import platforms from "platforms/platforms"

const useDriveOAuth = () =>
  useOauthPopupWindow<{ access_token: string }>("GOOGLE", undefined, {
    scope: `${platforms.GOOGLE.oauth.params.scope} https://www.googleapis.com/auth/drive.file`,
    response_type: "token",
  })

export default useDriveOAuth
