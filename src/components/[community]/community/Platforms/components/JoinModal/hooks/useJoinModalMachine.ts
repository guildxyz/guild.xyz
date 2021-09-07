import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { usePersonalSign } from "components/_app/PersonalSignStore"
import { useEffect } from "react"
import { Machine } from "temporaryData/types"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

const MESSAGE = "Please sign this message to generate your invite link"

type Invite = {
  inviteLink: string
  alreadyJoined?: boolean
}

const initialInviteData: Invite = { inviteLink: "", alreadyJoined: false }

type JoinError = MetaMaskError | Response | Error

type Context = {
  error?: JoinError
  inviteData?: Invite
  id: string
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
      id: null,
    },
    states: {
      idle: {
        on: { SIGN: "signing" },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: "fetching",
          onError: "error",
        },
      },
      fetching: {
        invoke: {
          src: "getInviteLink",
          onDone: "success",
          onError: "error",
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
    on: { RESET: "idle" },
  },
  {
    actions: {
      removeError: assign<Context>({ error: undefined }),
      removeInvite: assign<Context>({ inviteData: initialInviteData }),
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
  const [sign, , getSign] = usePersonalSign()

  const { account } = useWeb3React()

  const [state, send] = useMachine(joinModalMachine, {
    services: {
      sign: () => sign(MESSAGE),
      getInviteLink: (context, event): Promise<Invite> =>
        fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
            communityId,
            addressSignedMessage: event.data ?? getSign(MESSAGE),
            ...(context.id ? { platformUserId: context.id } : {}),
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
