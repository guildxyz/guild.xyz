import BaseOAuthButton from "./BaseOauthButton"

const TwitterAuthButton = (): JSX.Element => (
  <BaseOAuthButton
    platform="TWITTER"
    connectText="Connect Twitter"
    connectedText="Twitter connected"
  />
)

export default TwitterAuthButton
