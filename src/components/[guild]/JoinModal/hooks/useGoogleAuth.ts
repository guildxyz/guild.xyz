import { useWeb3React } from "@web3-react/core"
import useLocalStorage from "hooks/useLocalStorage"
import usePopupWindow from "hooks/usePopupWindow"
import { useEffect, useState } from "react"

const useGoogleAuth = () => {
  const { account } = useWeb3React()
  const [code, setCode] = useState<string>(null)
  const [state, setState] = useState<string>(null)
  const [error, setError] = useState(null)

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/googleauth`

  const [urlState, setUrlState] = useLocalStorage("google_state", null)

  useEffect(() => {
    if (!account || urlState) return
    setUrlState(account?.toLowerCase())
  }, [account])

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(redirectUri)}&state=${urlState}`
  )

  // const {
  //   error: connectError,
  //   isLoading,
  //   isSigning,
  //   onSubmit: onConnectSubmit,
  //   signLoadingText,
  // } = useConnect()

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const popupMessageListener = async (event: MessageEvent) => {
      /**
       * Conditions are for security and to make sure, the expected messages are
       * being handled (extensions are also communicating with message events)
       */
      if (
        event.isTrusted &&
        // event.origin === windowInstance.location.origin &&
        typeof event.data === "object" &&
        "type" in event.data &&
        "data" in event.data
      ) {
        const { data, type } = event.data

        switch (type) {
          case "GOOGLE_AUTH_SUCCESS":
            if (data.state !== urlState) {
              setError({
                error: "Invalid state",
                errorDescription:
                  "Auth state doesn't match on Guild.xyz and on Google.",
              })
            } else {
              setCode(data.code)
              setState(data.state)
            }
            break
          default:
            // Should never happen, since we are only processing events that are originating from us
            setError({
              error: "Invalid message",
              errorDescription:
                "Received invalid message from authentication window",
            })
        }
        windowInstance?.close()
      }
    }

    window.addEventListener("message", popupMessageListener)
    return () => window.removeEventListener("message", popupMessageListener)
  }, [windowInstance])

  // useEffect(() => {
  //   if (!code) return
  //   onConnectSubmit({
  //     platformName: "GOOGLE",
  //     authData: {
  //       code,
  //       state,
  //       redirect_url: redirectUri,
  //     },
  //   })
  // }, [code])

  // useEffect(() => {
  //   if (!connectError) return
  //   setError(connectError)
  // }, [connectError])

  const authData = code &&
    state &&
    redirectUri && { code, state, redirect_url: redirectUri }

  return {
    code,
    authData,
    error,
    onOpen: () => {
      setError(null)
      onOpen()
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed, //  || isSigning || isLoading,
    // signLoadingText,
  }
}

export default useGoogleAuth
