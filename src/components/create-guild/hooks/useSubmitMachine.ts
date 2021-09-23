import { useMachine } from "@xstate/react"
import { usePersonalSign } from "components/_app/PersonalSignStore"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
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

const replacer = (key, value) => {
  if (key === "address" && value === "ETHER") return undefined
  return value
}

const useSubmitMachine = () => {
  const { mutate } = useSWRConfig()
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
          body: JSON.stringify(data, replacer),
        }),
      fetchLevels: async (context, { data }: any) => {
        const response = await data.json()
        // console.log(context.data)

        return fetch(
          `${process.env.NEXT_PUBLIC_API}/community/levels/${response?.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              addressSignedMessage: context.data.addressSignedMessage,
              imageUrl: context.data.imageUrl,
              levels: [
                {
                  name: context.data.name,
                  requirements: context.data.requirements,
                },
              ],
              discordServerId: context.data.discordServerId,
              inviteChannel: context.data.inviteChannel,
              categoryName: context.data.categoryName,
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
          description: "You're being redirected to it's page",
          status: "success",
          duration: 4000,
        })
        // refetch guilds to include the new one on the home page
        mutate("guilds")

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
