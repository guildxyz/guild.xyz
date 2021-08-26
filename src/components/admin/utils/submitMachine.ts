import { assign, createMachine, DoneInvokeEvent, EventObject } from "xstate"
import { ApiError } from "../hooks/useShowErrorToast"

export type ContextType = {
  urlName: string
}

// Successful data-flow events
export type InitialEvent<FormDataType> = EventObject & {
  data: FormDataType
}
export type SignEvent<FormDataType> = DoneInvokeEvent<
  FormDataType & {
    addressSignedMessage: string
    urlName: string // So we can do data.urlName to redirect
  }
>
export type FetchEvent = DoneInvokeEvent<Response | Response[]>

// Error events
export type SignError = DoneInvokeEvent<Error>
export type APIError = DoneInvokeEvent<{ errors: ApiError[] }>
export type ErrorEvent = SignError | APIError

const createSubmitMachine = <FormDataType>() =>
  createMachine<
    ContextType,
    InitialEvent<FormDataType> | SignEvent<FormDataType> | FetchEvent | ErrorEvent
  >(
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
            onDone: "fetch",
            onError: "error",
          },
        },
        fetch: {
          entry: "saveUrlName",
          invoke: {
            src: "fetch",
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
        saveUrlName: assign((_, { data: { urlName } }: SignEvent<FormDataType>) => ({
          urlName,
        })),
      },
    }
  )

export default createSubmitMachine
