import { useMachine } from "@xstate/react"
import { usePersonalSign } from "components/_app/PersonalSignStore"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import useJsConfetti from "./useJsConfetti"
import useShowErrorToast from "./useShowErrorToast"

const MESSAGE = "Please sign this message to verify your address"

export type ContextType = {
  data: any
}

export type FetchEvent = DoneInvokeEvent<Response | Response[]>

const machine = createMachine<ContextType>(
  {
    initial: "idle",
    states: {
      idle: {
        on: {
          SIGN: "sign",
        },
      },
      sign: {
        invoke: {
          src: "sign",
          onDone: "fetchCommunity",
          onError: "error",
        },
      },
      fetchCommunity: {
        entry: "saveData",
        invoke: {
          src: "fetchCommunity",
          onDone: [
            {
              target: "fetchLevels",
              cond: "fetchSuccessful",
            },
            {
              target: "parseError",
              cond: "fetchFailed",
            },
          ],
          onError: "error",
        },
      },
      fetchLevels: {
        invoke: {
          src: "fetchLevels",
          onDone: [
            {
              target: "success",
              cond: "fetchSuccessful",
            },
            {
              target: "parseError",
              cond: "fetchFailed",
            },
          ],
          onError: "error",
        },
      },
      success: {
        entry: ["showSuccessToast", "redirect"],
      },
      parseError: {
        invoke: {
          src: "parseError",
          onDone: "error",
          onError: "error",
        },
      },
      error: {
        entry: "showErrorToast",
        on: {
          SIGN: "sign",
        },
      },
    },
  },
  {
    services: {
      parseError: (_context, event: FetchEvent) => {
        if (Array.isArray(event.data)) {
          return Promise.all(event.data.map((res) => res.json())).catch(() =>
            Promise.reject(new Error("Network error"))
          )
        }
        return event.data
          .json()
          .catch(() => Promise.reject(new Error("Network error")))
      },
    },
    guards: {
      fetchSuccessful: (_context, event: FetchEvent) => {
        if (Array.isArray(event.data)) return event.data.every(({ ok }) => !!ok)
        return !!event.data.ok
      },
      fetchFailed: (_context, event: FetchEvent) => {
        if (Array.isArray(event.data)) return event.data.some(({ ok }) => !ok)
        return !event.data.ok
      },
    },
    actions: {
      saveData: assign((_, { data }: any) => ({
        data,
      })),
    },
  }
)

const useSubmitMachine = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const [sign, hasMessage, getSign] = usePersonalSign()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const [state, send] = useMachine(machine, {
    services: {
      fetchCommunity: async (_, { data }) =>
        fetch(`${process.env.NEXT_PUBLIC_API}/community`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      fetchLevels: async (context, { data }: any) => {
        const response = await data.json()

        return fetch(
          `${process.env.NEXT_PUBLIC_API}/community/levels/${response?.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              addressSignedMessage: context.data.addressSignedMessage,
              levels: [
                {
                  name: context.data.name,
                  requirements: context.data.requirements,
                },
              ],
              discordServerId: "886314998131982336",
              inviteChannel: "886314998131982339",
            }),
          }
        )
      },
      sign: async (_, { data }) => {
        if (hasMessage(MESSAGE))
          return { ...data, addressSignedMessage: getSign(MESSAGE) }
        const addressSignedMessage = await sign(MESSAGE).catch(() =>
          Promise.reject(new Error())
        )
        return { ...data, addressSignedMessage }
      },
    },
    actions: {
      showErrorToast: (_context, { data: error }: any) => {
        if (error instanceof Error) showErrorToast(error.message)
        else showErrorToast(error.errors)
      },
      showSuccessToast: (context) => {
        triggerConfetti()
        toast({
          title: "Guild successfully created!",
          description:
            "You're being redirected to it's page. It might take up to 10 sec for it to show up in the explorer",
          status: "success",
          duration: 4000,
        })
        router.push(`/${context.data.urlName}`)
      },
    },
  })

  const onSubmit = (data) => {
    send("SIGN", { data })
  }

  return {
    onSubmit,
    isLoading: ["sign", "fetchCommunity", "fetchLevels", "parseError"].some(
      state.matches
    ),
    state,
    isSuccess: state.matches("success"),
  }
}

export default useSubmitMachine
