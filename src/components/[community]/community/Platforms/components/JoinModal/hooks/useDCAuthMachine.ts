import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { useEffect, useRef } from "react"
import { DiscordError, Machine } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

export type ContextType = {
  error: DiscordError | Response
  id: string
}

type AuthEvent = DoneInvokeEvent<{ id: string }>
type ErrorEvent = DoneInvokeEvent<DiscordError | Response>

const dcAuthMachine = createMachine<ContextType, AuthEvent | ErrorEvent>(
  {
    initial: "checkIsMember",
    context: {
      error: null,
      id: null,
    },
    states: {
      checkIsMember: {
        entry: "checkIsMember",
        on: {
          HAS_ID: "idKnown",
          NO_ID: "idle",
          ERROR: "checkIsMemberError",
        },
      },
      checkIsMemberError: {
        entry: "setIsMemberError",
        on: { RESET: "checkIsMember" },
        exit: "removeError",
      },
      idle: {
        on: { AUTH: "authenticating", RESET: "checkIsMember" },
      },
      authenticating: {
        entry: "openWindow",
        invoke: {
          src: "auth",
          onDone: "successNotification",
          onError: "error",
        },
        exit: "closeWindow",
        on: { RESET: "checkIsMember" },
      },
      error: {
        entry: "setError",
        on: {
          AUTH: "authenticating",
          CLOSE_MODAL: "idle",
          RESET: "checkIsMember",
        },
        exit: "removeError",
      },
      successNotification: {
        entry: "setId",
        on: {
          CLOSE_MODAL: "idKnown",
          HIDE_NOTIFICATION: "idKnown",
          RESET: "checkIsMember",
        },
      },
      idKnown: { on: { RESET: "checkIsMember" } },
    },
  },
  {
    actions: {
      setId: assign<ContextType, AuthEvent>({
        id: (_, event) => event.data.id,
      }),
      setError: assign<ContextType, ErrorEvent>({
        error: (_, event) => event.data,
      }),
      removeError: assign<ContextType>({ error: null }),
      setIsMemberError: assign<ContextType>({ error: new Response() }),
    },
  }
)

const useDCAuthMachine = (): Machine<ContextType> => {
  const { urlName } = useCommunity()
  const { account } = useWeb3React()
  const authWindow = useRef<Window>(null)
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

  const [state, send] = useMachine(dcAuthMachine, {
    actions: {
      checkIsMember: () =>
        fetch(`${process.env.NEXT_PUBLIC_API}/user/isMember`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform: "DISCORD",
            address: account,
          }),
        })
          .then((response) => {
            if (response.ok)
              response.json().then((data) => {
                if (data) send("HAS_ID")
                else send("NO_ID")
              })
            else send("NO_ID")
          })
          .catch(() => send("ERROR")),

      openWindow: () => {
        authWindow.current = window.open(
          `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${urlName}`,
          "dc_auth",
          `height=750,width=600,scrollbars`
        )

        // Could only capture a "beforeunload" event if the popup and the opener would be on the same domain
        const timer = setInterval(() => {
          if (authWindow.current.closed) {
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

      closeWindow: () => {
        window.removeEventListener("message", listener.current)
        listener.current = null
        authWindow.current.close()
      },
    },
    services: {
      auth: () =>
        new Promise((resolve, reject) => {
          listener.current = handleMessage(resolve, reject)
          window.addEventListener("message", listener.current)
        }),
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useDCAuthMachine
