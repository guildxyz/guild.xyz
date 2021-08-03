import { TransactionResponse } from "@ethersproject/providers"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import type { Machine, MetaMaskError, Token } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import useTokenAllowance from "./useTokenAllowance"

type Context = {
  error: MetaMaskError
}

type ErrorEvent = DoneInvokeEvent<MetaMaskError>
type TransactionEvent = DoneInvokeEvent<TransactionResponse>
type Event = ErrorEvent | TransactionEvent

const allowanceMachine = createMachine<Context, Event>(
  {
    initial: "allowanceGranted",
    context: {
      error: null,
    },
    states: {
      noAllowance: {
        on: {
          ALLOW: "waitingConfirmation",
          PERMISSION_IS_PENDING: "waitingForTransaction",
          PERMISSION_IS_GRANTED: "allowanceGranted",
        },
      },
      waitingConfirmation: {
        invoke: {
          src: "allowToken",
          onDone: "waitingForTransaction",
          onError: "error",
        },
        on: {
          PERMISSION_IS_PENDING: "waitingForTransaction",
          PERMISSION_IS_GRANTED: "successNotification",
        },
      },
      waitingForTransaction: {
        invoke: {
          src: "waitForTransactionSuccess",
          onDone: {
            target: "successNotification",
          },
          onError: "error",
        },
        on: {
          PERMISSION_IS_GRANTED: "successNotification",
        },
      },
      successNotification: {
        on: {
          HIDE_NOTIFICATION: "allowanceGranted",
          CLOSE_MODAL: "allowanceGranted",
          PERMISSION_NOT_GRANTED: "noAllowance",
        },
      },
      allowanceGranted: {
        on: {
          PERMISSION_NOT_GRANTED: "noAllowance",
          PERMISSION_IS_PENDING: "waitingForTransaction",
        },
      },
      error: {
        on: {
          ALLOW: "waitingConfirmation",
          CLOSE_MODAL: "noAllowance",
          PERMISSION_IS_PENDING: "waitingForTransaction",
          PERMISSION_IS_GRANTED: "allowanceGranted",
        },
        entry: "setError",
        exit: "removeError",
      },
    },
  },
  {
    actions: {
      removeError: assign({ error: null }),
      setError: assign<Context, ErrorEvent>({
        error: (_, event) => event.data,
      }),
    },
  }
)

const useTokenAllowanceMachine = (token: Token): Machine<Context> => {
  const [tokenAllowance, allowToken] = useTokenAllowance(token)

  const [state, send] = useMachine<Context, Event>(allowanceMachine, {
    services: {
      allowToken,
      waitForTransactionSuccess: async (_, event: TransactionEvent) =>
        event.data.wait(),
    },
  })

  useEffect(() => {
    if (tokenAllowance === undefined) return
    if (tokenAllowance) send("PERMISSION_IS_GRANTED")
    else send("PERMISSION_NOT_GRANTED")
  }, [tokenAllowance, send])

  return [state, send]
}

export default useTokenAllowanceMachine
