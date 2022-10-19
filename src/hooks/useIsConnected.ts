import useUser from "components/[guild]/hooks/useUser"
import { PlatformName } from "types"

const useIsConnected = (platform: PlatformName) => {
  const { platformUsers } = useUser()
  return platformUsers?.find(({ platformName }) => platformName === platform)
}

export default useIsConnected
