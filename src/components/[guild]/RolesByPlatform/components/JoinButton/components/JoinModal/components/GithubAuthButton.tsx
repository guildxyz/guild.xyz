import BaseOAuthButton from "./BaseOauthButton"

const GithubAuthButton = (): JSX.Element => (
  <BaseOAuthButton
    connectText="Connect GitHub"
    connectedText="GitHub connected"
    platform="GITHUB"
  />
)

export default GithubAuthButton
