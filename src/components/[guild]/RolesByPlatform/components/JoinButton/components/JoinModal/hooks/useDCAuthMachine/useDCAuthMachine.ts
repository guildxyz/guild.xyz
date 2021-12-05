import { useMachine } from "@xstate/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { DiscordError, Machine } from "types"
import newNamedError from "utils/newNamedError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import handleMessage from "./utils/handleMessage"

export type ContextType = {
  error: DiscordError | Response | Error
  id: string
}

type AuthEvent = DoneInvokeEvent<{ id: string }>
type ErrorEvent = DoneInvokeEvent<DiscordError | Response | Error>

const dcAuthMachine = createMachine<ContextType, AuthEvent | ErrorEvent>(
  {
    initial: "idle",
    context: {
      error: null,
      id: null,
    },
    states: {
      idle: {
        on: { AUTH: "authenticating", ID_KNOWN: "idKnown" },
      },
      authenticating: {
        entry: "openWindow",
        invoke: {
          src: "auth",
          onDone: "idKnown.successNotification",
          onError: "error",
        },
        exit: "closeWindow",
        on: { ID_KNOWN: "idKnown", NO_ID: "idle" },
      },
      error: {
        entry: "setError",
        on: {
          AUTH: "authenticating",
          CLOSE_MODAL: "idle",
          NO_ID: "idle",
          ID_KNOWN: "idKnown",
        },
        exit: "removeError",
      },
      idKnown: {
        entry: "setId",
        on: { NO_ID: "idle" },
        initial: "idle",
        states: {
          successNotification: {
            on: {
              CLOSE_MODAL: "idle",
              HIDE_NOTIFICATION: "idle",
              ID_KNOWN: "idle",
            },
          },
          idle: {},
        },
      },
    },
  },
  {
    actions: {
      setId: assign<ContextType, AuthEvent>({
        id: (_, event) => event.data?.id,
      }),
      setError: assign<ContextType, ErrorEvent>({
        error: (_, event) => event.data,
      }),
      removeError: assign<ContextType>({ error: null }),
    },
  }
)

const useDCAuthMachine = (): Machine<ContextType> => {
  const guild = useGuild()
  const authWindow = useRef<Window>(null)
  const listener = useRef<(event: MessageEvent) => void>()
  const { discordId: discordIdFromDb } = useUser()
  const router = useRouter()

  const [state, send] = useMachine(dcAuthMachine, {
    actions: {
      openWindow: () => {
        authWindow.current = window.open(
          `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${guild?.urlName}`,
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
    if (discordIdFromDb) {
      send("ID_KNOWN")
      return
    }
    if (router.query.discordId) {
      const sendHashedId = async () => {
        const hashResponse = await fetch("/api/hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: router.query.discordId }),
        })
        if (!hashResponse.ok) {
          send({
            type: "error",
            data: newNamedError("Hashing error", "Failed to hash Discord user ID"),
          })
          return
        }
        const { hashed } = await hashResponse.json()
        send({ type: "ID_KNOWN", data: { id: hashed } })
      }
      sendHashedId()
      return
    }
    send("NO_ID")
  }, [discordIdFromDb, router.query.discordId])

  return [state, send]
}

export default useDCAuthMachine
