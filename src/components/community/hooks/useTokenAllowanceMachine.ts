import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import type { Token } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import useTokenAllowance from "./useTokenAllowance"

type AllowanceCheckEvent =
  | {
      type: "PERMISSION_NOT_GRANTED"
    }
  | {
      type: "PERMISSION_IS_PENDING"
    }
  | {
      type: "PERMISSION_IS_GRANTED"
    }

type ContextType = {
  error: any
}

const allowanceMachine = createMachine<
  ContextType,
  DoneInvokeEvent<any> | AllowanceCheckEvent
>(
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
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useTokenAllowanceMachine = (token: Token): any => {
  const [tokenAllowance, allowToken] = useTokenAllowance(token)

  const [state, send] = useMachine<any, any>(allowanceMachine, {
    services: {
      allowToken,
      waitForTransactionSuccess: async (_, event: DoneInvokeEvent<any>) =>
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
