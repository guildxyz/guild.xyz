import { useMachine } from "@xstate/react"
import useShowErrorToast from "components/create-guild/hooks/useShowErrorToast"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

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
          DELETE: "deleteCommunity",
        },
      },
      deleteCommunity: {
        entry: "saveData",
        invoke: {
          src: "deleteCommunity",
          onDone: [
            {
              target: "success",
              cond: "deleteSuccessful",
            },
            {
              target: "parseError",
              cond: "deleteFailed",
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
          DELETE: "deleteCommunity",
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
      deleteSuccessful: (_context, event: FetchEvent) => {
        if (Array.isArray(event.data)) return event.data.every(({ ok }) => !!ok)
        return !!event.data.ok
      },
      deleteFailed: (_context, event: FetchEvent) => {
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

const useDeleteMachine = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const { id } = useGuild()
  const router = useRouter()

  const [state, send] = useMachine(machine, {
    services: {
      deleteCommunity: async (context, { data }) =>
        fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            addressSignedMessage,
          }),
        }),
    },
    actions: {
      showErrorToast: (_context, { data: error }: any) => {
        if (error instanceof Error) showErrorToast(error.message)
        else showErrorToast(error.errors)
      },
      showSuccessToast: () => {
        toast({
          title: "Guild deleted!",
          description: "You're being redirected to the home page",
          status: "success",
          duration: 4000,
        })
        // refetch guilds
        mutate("guilds")

        router.push("/")
      },
    },
  })

  const onSubmit = (data) => {
    send("DELETE", { data })
  }

  return {
    onSubmit,
    isLoading: ["deleteCommunity", "parseError"].some(state.matches),
    state,
    isSuccess: state.matches("success"),
  }
}

export default useDeleteMachine
