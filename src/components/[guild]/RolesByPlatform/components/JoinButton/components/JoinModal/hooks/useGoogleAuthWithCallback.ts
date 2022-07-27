import useUser from "components/[guild]/hooks/useUser"
import { useEffect, useState } from "react"
import { PlatformType } from "types"
import useGoogleAuth from "./useGoogleAuth"

const useGoogleAuthWithCallback = (callback: () => void) => {
  const { platformUsers } = useUser()
  const isGoogleConnected = platformUsers?.find(
    (pu) => pu.platformId === PlatformType.GOOGLE
  )

  const { code, onOpen, isAuthenticating, ...rest } = useGoogleAuth()
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (isGoogleConnected) callback()
    else {
      onOpen()
      setHasClickedAuth(true)
    }
  }

  useEffect(() => {
    if (!code || !hasClickedAuth || isAuthenticating) return
    callback()
  }, [code, isAuthenticating, hasClickedAuth])

  return {
    callbackWithGoogleAuth: handleClick,
    code,
    isGoogleConnected,
    isAuthenticating,
    ...rest,
  }
}

export default useGoogleAuthWithCallback
