import { useUserPublic } from "components/[guild]/hooks/useUser"
import { useRouter } from "next/router"
import { posthog } from "posthog-js"
import {
  PostHogProvider as DefaultPostHogProvider,
  usePostHog,
} from "posthog-js/react"
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react"
import { User } from "types"
import useConnectorNameAndIcon from "./Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import useWeb3ConnectionManager from "./Web3ConnectionManager/hooks/useWeb3ConnectionManager"

const USER_REJECTED_ERROR = "User rejected the request"
const REJECT_BY_THE_USER_ERROR = "Reject by the user"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/api/posthog",
    // Capture custom events only
    autocapture: false,

    // Turned on for PostHog Web Analytics
    capture_pageleave: true,
    capture_pageview: true,

    // We don't record every session, but we can start recording with the `startSessionRecording` function where we actually want to save videos
    disable_session_recording: true,

    persistence: "memory",

    // Disable in development
    // loaded: (ph) => {
    //   if (
    //     process.env.NODE_ENV !== "production" ||
    //     window.location.host !== "guild.xyz"
    //   )
    //     ph.opt_out_capturing()
    // },
  })
}

const PostHogContext = createContext<{
  identifyUser: (userData: User) => void
  captureEvent: (event: string, options?: Record<string, any>) => void
  startSessionRecording: () => void
}>({
  identifyUser: () => {},
  captureEvent: () => {},
  startSessionRecording: () => {},
})

const CustomPostHogProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const { isWeb3Connected, address, type: walletType } = useWeb3ConnectionManager()
  const { connectorName } = useConnectorNameAndIcon()
  const { id } = useUserPublic()
  const ph = usePostHog()

  useEffect(() => {
    if (!isWeb3Connected) {
      ph.reset()
    }
  }, [isWeb3Connected, ph])

  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => ph.capture("$pageview")
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const identifyUser = useCallback(
    (userData: User) => {
      posthog.identify(userData.id.toString(), {
        primaryAddress: userData.addresses.find((a) => a.isPrimary).address,
        currentAddress: address,
        walletType,
        wallet: connectorName,
      })
    },
    [address, connectorName, walletType]
  )

  return (
    <PostHogContext.Provider
      value={{
        identifyUser,
        captureEvent: (event, options) => {
          // TODO: find a better approach here...
          const errorMessage =
            typeof options?.error?.message === "string"
              ? options.error.message
              : typeof options?.error === "string"
              ? options.error
              : typeof options?.errorMessage === "string"
              ? options.errorMessage
              : undefined

          if (
            /**
             * We're filtering out errors with correlationIds, because those errors
             * are already logged on our backend, there's no reason to log them here
             * too
             */
            options?.error?.correlationId ||
            options?.originalError?.correlationId ||
            /**
             * Also filtering the "User rejected the request" error, because that is
             * not an error actually, the user can intentionally reject a
             * transaction
             */
            errorMessage?.includes(USER_REJECTED_ERROR) ||
            errorMessage?.includes(REJECT_BY_THE_USER_ERROR)
          )
            return

          /**
           * Saving user details to events too, just in case we decide not to use
           * `$identify` in the future (we'll have a "plan B" in that case)
           */
          ph.capture(event, {
            userId: id,
            userAddress: address?.toLowerCase(),
            walletType,
            wallet: connectorName,
            ...options,
          })
        },
        startSessionRecording: () => ph.startSessionRecording(),
      }}
    >
      {children}
    </PostHogContext.Provider>
  )
}

const PostHogProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <DefaultPostHogProvider client={posthog}>
    <CustomPostHogProvider>{children}</CustomPostHogProvider>
  </DefaultPostHogProvider>
)

const usePostHogContext = () => useContext(PostHogContext)

export { PostHogProvider, usePostHogContext }
