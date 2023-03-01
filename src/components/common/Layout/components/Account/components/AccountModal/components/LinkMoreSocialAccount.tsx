import { Text } from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { PlatformName } from "types"

type Props = {
  platformName: string
}

const LinkMoreSocialAccount = ({ platformName }: Props): JSX.Element => {
  console.log(platformName)

  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platformName as PlatformName
  )
  return (
    <>
      <Text onClick={onConnect}>{platformName}</Text>
    </>
  )
}

export default LinkMoreSocialAccount
