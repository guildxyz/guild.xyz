import { usePostHogContext } from "components/_app/PostHogProvider"
import usePopupWindow from "hooks/usePopupWindow"
import useToast from "hooks/useToast"
import platforms from "platforms/platforms"
import randomBytes from "randombytes"
import { useEffect, useState } from "react"
import { OneOf, PlatformName } from "types"

type OAuthData<Data> = {
  redirect_url: string
  scope?: string
} & Data

type OAuthError = { error: string; errorDescription: string }

export type Message = OneOf<
  { type: "OAUTH_ERROR"; data: OAuthError },
  { type: "OAUTH_SUCCESS"; data: any }
>

type OAuthState<OAuthResponse> = {
  error: OAuthError
  authData: OAuthData<OAuthResponse>
  isAuthenticating: boolean
}

export type AuthLevel<
  T = (typeof platforms)[PlatformName]["oauth"]["params"]["scope"]
> = T extends string ? never : keyof T

type TGAuthResult = {
  event: "auth_result"
  result: {
    id: number
    first_name: string
    username: string
    photo_url: string
    auth_date: number
    hash: string
  }
  origin: string
}

const useOauthPopupWindow = <OAuthResponse = { code: string }>(
  platformName: PlatformName,
  authLevel: AuthLevel = "membership",
  paramOverrides = {}
): OAuthState<OAuthResponse> & {
  onOpen: () => Promise<OAuthState<OAuthResponse>>
} => {
  const { captureEvent } = usePostHogContext()

  const { params, url, oauthOptionsInitializer } = platforms[platformName]
    ?.oauth ?? {
    params: {} as any,
  }

  const toast = useToast()

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/oauth`

  params.response_type = params.response_type ?? "code"

  const { onOpen } = usePopupWindow()

  const [oauthState, setOauthState] = useState<OAuthState<OAuthResponse>>({
    error: null,
    authData: null,
    isAuthenticating: false,
  })

  const oauthPopupHandler = async () => {
    let result: OAuthState<OAuthResponse> = {
      isAuthenticating: true,
      authData: null,
      error: null,
    }
    setOauthState(result)

    let finalOauthParams = params

    if (oauthOptionsInitializer) {
      try {
        finalOauthParams = await oauthOptionsInitializer(redirectUri)
      } catch (error) {
        result = {
          error: {
            error: "Error",
            errorDescription: error.message,
          },
          isAuthenticating: false,
          authData: null,
        }

        setOauthState(result)
        return
      }
    }

    if (paramOverrides) {
      finalOauthParams = {
        ...finalOauthParams,
        ...paramOverrides,
      }
    }

    const csrfToken = randomBytes(32).toString("hex")
    const localStorageKey = `${platformName}_oauthinfo`

    const infoToPassInLocalStorage = {
      csrfToken,
      from: window.location.toString(),
      platformName,
      redirect_url: redirectUri,
      scope: finalOauthParams.scope ?? "",
    }

    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify(infoToPassInLocalStorage)
    )

    const channel = new BroadcastChannel(
      platformName === "TWITTER_V1" ? "TWITTER_V1" : csrfToken
    )

    const getTgListener =
      (resolve: (value: void | PromiseLike<void>) => void) =>
      (event: MessageEvent<any>) => {
        if (
          event.origin ===
            process.env.NEXT_PUBLIC_TELEGRAM_POPUP_URL.replace("/tgauth", "") &&
          "type" in event.data &&
          ["TG_AUTH_SUCCESS", "TG_AUTH_ERROR"].includes(event.data.type)
        ) {
          try {
            const { type, data } = event.data as
              | { type: "TG_AUTH_SUCCESS"; data: TGAuthResult["result"] }
              | {
                  type: "TG_AUTH_ERROR"
                  data: { error: string; errorDescription: string }
                }

            result =
              type === "TG_AUTH_SUCCESS"
                ? {
                    isAuthenticating: false,
                    error: null,
                    authData: data as any,
                  }
                : {
                    isAuthenticating: false,
                    error: data,
                    authData: null,
                  }

            setOauthState(result)
            resolve()
          } catch {}
        }
      }

    let tgListener: (event: MessageEvent<any>) => void

    const hasReceivedResponse = new Promise<void>((resolve) => {
      tgListener = getTgListener(resolve)
      window.addEventListener("message", tgListener)

      channel.onmessage = (event: MessageEvent<Message>) => {
        const { type, data } = event.data

        if (type === "OAUTH_ERROR") {
          result = {
            isAuthenticating: false,
            error: data,
            authData: null,
          }
          setOauthState(result)
        } else {
          result = {
            isAuthenticating: false,
            error: null,
            authData: data,
          }
          setOauthState(result)
        }

        resolve()
      }
    })

    const searchParams = new URLSearchParams({
      ...finalOauthParams,
      redirect_uri: redirectUri,
      state: `${platformName}-${csrfToken}`,
      scope: finalOauthParams.scope
        ? typeof finalOauthParams.scope === "string"
          ? finalOauthParams.scope
          : finalOauthParams.scope[authLevel]
        : undefined,
    }).toString()

    onOpen(`${url}?${searchParams}`)

    await hasReceivedResponse.finally(() => {
      channel.postMessage({ type: "OAUTH_CONFIRMATION" })
      window.localStorage.removeItem(localStorageKey)
      // Close Broadcast Channel
      channel.close()
      window.removeEventListener("message", tgListener)
    })

    return result
  }

  useEffect(() => {
    if (!oauthState.error) return

    const title = oauthState.error.error ?? "Unknown error"
    const errorDescription = oauthState.error.errorDescription ?? ""

    toast({ status: "error", title, description: errorDescription })
  }, [oauthState.error])

  if (!platforms[platformName]?.oauth) {
    return {} as any
  }

  return {
    ...oauthState,
    onOpen: oauthPopupHandler,
  }
}

export default useOauthPopupWindow
