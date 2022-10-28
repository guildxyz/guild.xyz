import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useState } from "react"
import { PlatformName } from "types"
import useOauthPopupWindow from "./useOauthPopupWindow"

const useOAuthWithCallback = (
  platform: PlatformName,
  callback: () => void,
  scopeType: "membership" | "creation" = "membership"
) => {
  const { platformUsers } = useUser()
  const isPlatformConnected = platformUsers?.some(
    ({ platformName, platformUserData }) =>
      platformName === platform && !platformUserData?.readonly
  )

  const { onOpen, authData, ...rest } = useOauthPopupWindow(platform, scopeType)

  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (isPlatformConnected) callback()
    else {
      onOpen()
      setHasClickedAuth(true)
    }
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

export default useOAuthWithCallback
