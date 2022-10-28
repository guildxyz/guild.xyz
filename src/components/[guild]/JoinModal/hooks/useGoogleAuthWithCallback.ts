import useUser from "components/[guild]/hooks/useUser"
import platforms from "platforms"
import { useEffect, useState } from "react"
import useGoogleAuth from "./useGoogleAuth"

const useGoogleAuthWithCallback = (callback: () => void) => {
  const { platformUsers } = useUser()
  const isGoogleConnected = platformUsers?.find(
    (pu) => pu.platformId === platforms.GOOGLE.id
  )

  const { onOpen, isAuthenticating, authData, ...rest } = useGoogleAuth()
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (isGoogleConnected) callback()
    else {
      onOpen()
      setHasClickedAuth(true)
    }
  }

  useEffect(() => {
    if (!authData?.code || !hasClickedAuth || isAuthenticating) return
    callback()
  }, [authData, isAuthenticating, hasClickedAuth])

  return {
    callbackWithGoogleAuth: handleClick,
    isGoogleConnected,
    isAuthenticating,
    authData,
    ...rest,
  }
}

export default useGoogleAuthWithCallback
