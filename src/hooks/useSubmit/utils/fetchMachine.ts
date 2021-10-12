import { assign, createMachine } from "xstate"

export interface Context<ResponseType> {
  response?: ResponseType
  error?: string
}

export type Event<DataType> =
  | {
      type: "FETCH"
      data: DataType
    }
  | {
      type: "CANCEL"
    }

const createFetchMachine = <DataType, ResponseType>() =>
  createMachine<Context<ResponseType>, Event<DataType>>(
    {
      id: "fetchMachine",
      initial: "idle",
      context: {},
      states: {
        idle: {
          on: {
            FETCH: {
              target: "fetching",
            },
          },
          initial: "noError",
          states: {
            noError: {
              entry: ["clearError"],
            },
            errored: {},
          },
        },
        fetching: {
          on: {
            FETCH: {
              target: "fetching",
            },
            CANCEL: {
              target: "idle",
            },
          },
          invoke: {
            src: "fetch",
            onError: {
              target: "idle.errored",
              actions: ["assignErrorToContext", "onError"],
            },
            onDone: {
              target: "idle",
              actions: ["assignDataToContext", "onSuccess"],
            },
          },
        },
      },
    },
    {
      actions: {
        assignDataToContext: assign((_context, event: any) => ({
          response: event?.data,
        })),
        clearError: assign({
          error: undefined,
        }),
        assignErrorToContext: assign((_context, event: any) => ({
          error: event.data?.message || "An unknown error occurred",
        })),
      },
    }
  )

export default createFetchMachine
