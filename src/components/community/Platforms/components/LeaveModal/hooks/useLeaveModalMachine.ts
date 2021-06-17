import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { SignErrorType } from "../../JoinModal/hooks/usePersonalSign"

type ContextType = {
  error: SignErrorType | null
}

const leaveModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>({
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
      entry: assign({
        error: (_, event) => event.data,
      }),
      exit: assign({
        error: () => null,
      }),
    },
  },
})

const useLeaveModalMachine = (platform: string): any => {
  const { id: communityId } = useCommunity()
  const { account } = useWeb3React()

  return useMachine(leaveModalMachine, {
    services: {
      // ! This is a dummy function for the demo !
      // Depending on what the returned error will look like, we might need to add a new type to ErrorType in Error.tsx
      leavePlatform: async (): Promise<SignErrorType | null> => {
        console.log({ account, platform, communityId })
        return new Promise((resolve, reject) => {
          setTimeout(
            () =>
              // eslint-disable-next-line prefer-promise-reject-errors
              reject({
                code: 1,
                message: "Not implemented",
              }),
            1000
          )
        })
      },
    },
  })
}

export default useLeaveModalMachine
