import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import { Machine } from "temporaryData/types"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type Context = {
  error?: MetaMaskError
}

type Event = DoneInvokeEvent<MetaMaskError>

const leaveModalMachine = createMachine<Context, Event>(
  {
    initial: "idle",
    context: {
      error: null,
    },
    states: {
      idle: {
        on: { LEAVE: "fetching" },
      },
      fetching: {
        invoke: {
          src: "leavePlatform",
          onDone: {
            // TODO: will show a success notification and close the modal
            target: "idle",
          },
          onError: {
            target: "error",
          },
        },
      },
      error: {
        on: { LEAVE: "fetching", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
    },
  },
  {
    actions: {
      setError: assign({
        error: (_, event) => event.data,
      }),
      removeError: assign({ error: null }),
    },
  }
)

const useLeaveModalMachine = (platform: string): Machine<Context> => {
  const { id: communityId } = useCommunity()
  const { account } = useWeb3React()

  const [state, send] = useMachine(leaveModalMachine, {
    services: {
      // ! This is a dummy function for the demo !
      // Depending on what the returned error will look like, we might need to add a new type to ErrorType in Error.tsx
      leavePlatform: async (): Promise<MetaMaskError> => {
        console.log({ account, platform, communityId })
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error()), 100)
        })
      },
    },
  })

  return [state, send]
}

export default useLeaveModalMachine
