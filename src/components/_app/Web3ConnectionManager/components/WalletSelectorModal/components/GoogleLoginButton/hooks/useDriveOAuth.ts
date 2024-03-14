import useOauthPopupWindow from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import rewards from "platforms/rewards"

const useDriveOAuth = () =>
  useOauthPopupWindow<{ access_token: string }>("GOOGLE", undefined, {
    scope: `${rewards.GOOGLE.oauth.params.scope} https://www.googleapis.com/auth/drive.file`,
    response_type: "token",
  })

export default useDriveOAuth
