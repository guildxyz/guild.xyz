import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import { useEffect } from "react"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "../../JoinModal/hooks/usePersonalSign"

type InviteData = {
  inviteLink: string
  joinCode?: number
}

const initialInviteData: InviteData = { inviteLink: "", joinCode: null }

type ContextType = {
  error: MetaMaskError | Response | Error | null
  inviteData: InviteData
  accessToken?: string
  tokenType?: string
  id: string
}

const joinModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
      inviteData: initialInviteData,
      accessToken: null,
      tokenType: null,
      id: null,
    },
    states: {
      idle: {
        on: {
          AUTH: "auth",
          // AUTHDONE: "fetchingUserData",
          "": {
            target: "fetchingUserData",
            cond: "areHashParamsSet",
          },
        },
      },
      auth: {
        on: {
          CLOSE_MODAL: "idle",
        },
      },
      fetchingUserData: {
        entry: "saveHashParams",
        invoke: {
          src: "fetchUserData",
          onDone: "signIdle",
          onError: "authError",
        },
        exit: "removeHashParams",
      },
      signIdle: {
        entry: "saveUserId",
        on: {
          SIGN: "signing",
        },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: "registering",
          onError: "signError",
        },
      },
      signError: {
        on: { SIGN: "signing", CLOSE_MODAL: "signIdle" },
        entry: "setError",
        exit: "removeError",
      },
      authError: {
        on: { AUTH: "auth", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      registering: {
        invoke: {
          src: "register",
          onDone: "success",
          onError: "signError",
        },
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
  },
  {
    actions: {
      setError: assign({
        error: (_, event) => event.data,
      }),
      removeError: assign({
        error: () => null,
      }),
      saveUserId: assign((_, event) => ({
        id: event.data,
      })),
      removeHashParams: () =>
        window.history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search
        ),
    },
    guards: {
      areHashParamsSet: () => {
        if (window.location.hash) {
          const fragment = new URLSearchParams(window.location.hash.slice(1))
          const [accessToken, tokenType] = [
            fragment.get("access_token"),
            fragment.get("token_type"),
          ]
          return !!accessToken && !!tokenType
        }
        return false
      },
    },
  }
)

const useJoinModalMachine = (onOpen: () => void): any => {
  const { id: communityId } = useCommunity()
  const { account } = useWeb3React()
  const sign = usePersonalSign()

  const [state, send] = useMachine(joinModalMachine, {
    actions: {
      saveHashParams: assign((context) => {
        onOpen()
        const fragment = new URLSearchParams(window.location.hash.slice(1))
        const [accessToken, tokenType] = [
          fragment.get("access_token"),
          fragment.get("token_type"),
        ]
        return {
          ...context,
          accessToken,
          tokenType,
        }
      }),
    },
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),
      fetchUserData: async (context) =>
        fetch("https://discord.com/api/users/@me", {
          headers: {
            authorization: `${context.tokenType} ${context.accessToken}`,
          },
        })
          .then((result) => result.json())
          .then((response) => response.id),
      register: (context, event) =>
        fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform: "DISCORD",
            platformUserId: context.id,
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
