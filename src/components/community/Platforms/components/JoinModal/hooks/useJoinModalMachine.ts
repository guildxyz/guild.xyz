import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import type { SignErrorType } from "./usePersonalSign"
import { usePersonalSign } from "./usePersonalSign"

type InviteData = {
  inviteLink: string
  joinCode?: number
}

const initialInviteData: InviteData = { inviteLink: "", joinCode: null }

type ContextType = {
  error: SignErrorType | Response | Error | null
  inviteData: InviteData
}

const joinModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>({
  initial: "idle",
  context: {
    error: null,
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
      entry: assign({
        error: (_, event) => event.data,
      }),
      exit: assign({
        error: () => null,
      }),
    },
    success: {
      entry: assign({
        inviteData: (_, event) => event.data,
      }),
      exit: assign({
        inviteData: () => initialInviteData,
      }),
    },
  },
  on: {
    RESET: {
      target: "idle",
    },
  },
})

const useJoinModalMachine = (platform: string): any => {
  const { id: communityId } = useCommunity()
  const sign = usePersonalSign()
  const { account } = useWeb3React()

  const [state, send] = useMachine(joinModalMachine, {
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),

      getInviteLink: (_, event): Promise<InviteData> =>
        fetch("https://api.agora.space/api/user/joinPlatform", {
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
