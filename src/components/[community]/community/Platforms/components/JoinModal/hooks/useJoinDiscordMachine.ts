import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { useEffect, useRef } from "react"
import { DiscordError } from "temporaryData/types"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "./usePersonalSign"

type InviteData = {
  inviteLink: string
  alreadyJoined?: boolean
}

const initialInviteData: InviteData = { inviteLink: "", alreadyJoined: false }

type ContextType = {
  error: MetaMaskError | Response | Error | DiscordError | null
  inviteData: InviteData
  signedMessage: string
}

const joinModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
      inviteData: initialInviteData,
      signedMessage: null,
    },
    states: {
      idle: {
        on: {
          SIGN: "signing",
        },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: "authIdle",
          onError: "signError",
        },
      },
      signError: {
        on: { SIGN: "signing", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      authIdle: {
        entry: "saveSignedMessage",
        on: {
          AUTH: "authenticating",
        },
      },
      authenticating: {
        entry: "openDiscordAuthWindow",
        invoke: {
          src: "dcAuth",
          onDone: "fetching",
          onError: "authError",
        },
        exit: "closeDiscordAuthWindow",
      },
      fetching: {
        invoke: {
          src: "fetchJoinPlatform",
          onDone: "success",
          onError: "authError",
        },
      },
      authError: {
        on: { AUTH: "authenticating", CLOSE_MODAL: "authIdle" },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        entry: assign({
          inviteData: (_, event) => event.data,
        }),
        exit: assign({
          inviteData: () => initialInviteData,
        }),
      },
    },
    on: {
      RESET: {
        target: "idle",
      },
    },
  },
  {
    actions: {
      setError: assign({
        error: (_, event) => event.data,
      }),
      removeError: assign({
        error: () => null,
      }),
      saveSignedMessage: assign((_, event) => ({
        signedMessage: event.data,
      })),
    },
  }
)

const useJoinModalMachine = (): any => {
  const { id: communityId, urlName } = useCommunity()
  const { account } = useWeb3React()
  const sign = usePersonalSign()
  const dcAuthWindow = useRef<Window>(null)
  const listener = useRef<(event: MessageEvent) => void>()

  const handleMessage =
    (resolve: (value?: any) => void, reject: (value: any) => void) =>
    (event: MessageEvent) => {
      // Conditions are for security and to make sure, the expected messages are being handled
      // (extensions are also communicating with message events)
      if (
        event.isTrusted &&
        event.origin === window.location.origin &&
        typeof event.data === "object" &&
        "type" in event.data &&
        "data" in event.data
      ) {
        const { data, type } = event.data

        switch (type) {
          case "DC_AUTH_SUCCESS":
            resolve(data)
            break
          case "DC_AUTH_ERROR":
            reject(data)
            break
          default:
            // Should never happen, since we are only processing events that are originating from us
            reject({
              error: "Invalid message",
              errorDescription:
                "Recieved invalid message from authentication window",
            })
        }
      }
    }

  const [state, send] = useMachine(joinModalMachine, {
    actions: {
      openDiscordAuthWindow: () => {
        dcAuthWindow.current = window.open(
          `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${urlName}`,
          "dc_auth",
          `height=750,width=600,scrollbars`
        )

        // Could only capture a "beforeunload" event if the popup and the opener would be on the same domain
        const timer = setInterval(() => {
          if (dcAuthWindow.current.closed) {
            clearInterval(timer)
            window.postMessage(
              {
                type: "DC_AUTH_ERROR",
                data: {
                  error: "Authorization rejected",
                  errorDescription:
                    "Please try again and authenticate your Discord account in the popup window",
                },
              },
              window.origin
            )
          }
        }, 500)
      },
      closeDiscordAuthWindow: () => {
        window.removeEventListener("message", listener.current)
        listener.current = null
        dcAuthWindow.current.close()
      },
    },
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),
      dcAuth: () =>
        new Promise((resolve, reject) => {
          listener.current = handleMessage(resolve, reject)
          window.addEventListener("message", listener.current)
        }),
      fetchJoinPlatform: (context, event) =>
        fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform: "DISCORD",
            platformUserId: event.data.id,
            communityId,
            addressSignedMessage: context.signedMessage,
          }),
        }).then((response) =>
          response.ok ? response.json() : Promise.reject(response)
        ),
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useJoinModalMachine
