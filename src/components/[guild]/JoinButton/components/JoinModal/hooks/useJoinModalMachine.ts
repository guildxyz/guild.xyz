import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import { useEffect } from "react"
import { Machine } from "types"
import { WalletError } from "utils/processWalletError"
import { assign, createMachine, DoneInvokeEvent, EventObject } from "xstate"

type Invite = {
  inviteLink: string
  alreadyJoined?: boolean
}

const initialInviteData: Invite = { inviteLink: "", alreadyJoined: false }

type JoinError = WalletError | Response | Error

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
        on: { FETCH: "fetching" },
      },
      fetching: {
        entry: "setHashedId",
        invoke: {
          src: "getInviteLink",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: { FETCH: "fetching", CLOSE_MODAL: "idle" },
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
      setHashedId: assign<Context>({
        id: (_, event: EventObject & { id: string }) => event.id,
      }),
    },
  }
)

const useJoinModalMachine = (platform: string): Machine<Context> => {
  const { id: communityId } = useGuild()
  const { addressSignedMessage } = usePersonalSign()

  const { account } = useWeb3React()

  const [state, send] = useMachine(joinModalMachine, {
    services: {
      getInviteLink: (context, event): Promise<Invite> =>
        fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
            communityId,
            addressSignedMessage,
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
