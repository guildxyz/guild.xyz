import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useState } from "react"
import { PlatformName } from "types"
import { platformAuthHooks } from "./useConnectPlatform"

const useOAuthWithCallback = (
  platform: PlatformName,
  scope: string,
  callback: () => void
) => {
  const { platformUsers } = useUser()
  const isPlatformConnected = platformUsers?.some(
    ({ platformName }) => platformName === platform
  )

  const { authData, onOpen, ...rest } = platformAuthHooks[platform](scope)
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (
      !isPlatformConnected ||
      (platform === "GITHUB" &&
        platformUsers?.find((pu) => pu.platformName === "GITHUB")?.platformUserData
          ?.readonly)
    ) {
      onOpen()
      setHasClickedAuth(true)
      return
    }

    callback()
  }

  useEffect(() => {
    if (!authData || !hasClickedAuth) return

    callback()
  }, [authData, hasClickedAuth])

  return {
    callbackWithOAuth: handleClick,
    authData,
    ...rest,
  }
}

export { platformAuthHooks }
export default useOAuthWithCallback
