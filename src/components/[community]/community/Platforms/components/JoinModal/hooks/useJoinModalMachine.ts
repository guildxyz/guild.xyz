import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { useEffect } from "react"
import { Machine } from "temporaryData/types"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "./usePersonalSign"

type Invite = {
  inviteLink: string
  joinCode?: number
}

const initialInviteData: Invite = { inviteLink: "", joinCode: null }

type JoinError = MetaMaskError | Response | Error

type Context = {
  error?: JoinError
  inviteData?: Invite
}

type ErrorEvent = DoneInvokeEvent<JoinError>
type InviteEvent = DoneInvokeEvent<Invite>
type Event = ErrorEvent | InviteEvent

const joinModalMachine = createMachine<Context, Event>(
  {
    initial: "idle",
    context: {
      error: undefined,
      inviteData: initialInviteData,
    },
    states: {
      idle: {
        on: { SIGN: "signing" },
      },
      signing: {
        on: {
          CLOSE_MODAL: "idle",
        },
        invoke: {
          src: "sign",
          onDone: {
            target: "fetching",
          },
          onError: {
            target: "error",
          },
        },
      },
      fetching: {
        invoke: {
          src: "getInviteLink",
          onDone: {
            target: "success",
          },
          onError: {
            target: "error",
          },
        },
      },
      error: {
        on: { SIGN: "signing", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        entry: "setInvite",
        exit: "removeInvite",
      },
    },
    on: {
      RESET: {
        target: "idle",
      },
    },
  },
  {
    actions: {
      removeError: assign({ error: undefined }),
      removeInvite: assign({ inviteData: initialInviteData }),
      setError: assign<Context, ErrorEvent>({
        error: (_, event) => event.data,
      }),
      setInvite: assign<Context, InviteEvent>({
        inviteData: (_, event) => event.data,
      }),
    },
  }
)

const useJoinModalMachine = (platform: string): Machine<Context> => {
  const { id: communityId } = useCommunity()
  const sign = usePersonalSign()
  const { account } = useWeb3React()

  const [state, send] = useMachine(joinModalMachine, {
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),

      getInviteLink: (_, event): Promise<Invite> =>
        fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
            communityId,
            addressSignedMessage: event.data,
          }),
        }).then((response) =>
          response.ok ? response.json() : Promise.reject(response)
        ),
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useJoinModalMachine
export type { JoinError }
