import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useState } from "react"
import { PlatformName } from "types"
import useDCAuth from "./useDCAuth"
import useGHAuth from "./useGHAuth"
import useTwitterAuth from "./useTwitterAuth"

const platformAuthHooks: Record<
  Exclude<PlatformName, "" | "TELEGRAM">,
  (scope: string) => any
> = {
  DISCORD: useDCAuth,
  GITHUB: useGHAuth,
  TWITTER: useTwitterAuth,
}

const useOAuthWithCallback = (
  platform: PlatformName,
  scope: string,
  callback: () => void
) => {
  const { platformUsers } = useUser()
  const isPlatformConnected = platformUsers?.some(
    ({ platformName }) => platformName === platform
  )

  const { code, onOpen, ...rest } = platformAuthHooks[platform](scope)
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (isPlatformConnected) callback()
    else {
      onOpen()
      setHasClickedAuth(true)
    }
  }

  useEffect(() => {
    if (!code || !hasClickedAuth) return

    callback()
  }, [code, hasClickedAuth])

  return {
    callbackWithOAuth: handleClick,
    code,
    ...rest,
  }
}

export default useOAuthWithCallback
