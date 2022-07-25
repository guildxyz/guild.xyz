import { useEffect, useState } from "react"
import useGoogleAuth from "./useGoogleAuth"

const useGoogleAuthWithCallback = (callback: () => void) => {
  const { code, onOpen, isAuthenticating, ...rest } = useGoogleAuth()
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (code) callback()
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
    isAuthenticating,
    ...rest,
  }
}

export default useGoogleAuthWithCallback
