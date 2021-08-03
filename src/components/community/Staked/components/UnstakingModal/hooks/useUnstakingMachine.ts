import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import useStaked from "components/community/Staked/hooks/useStaked"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import { Machine } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type Context = {
  error?: Error
  transaction?: TransactionResponse
}

type ErrorEvent = DoneInvokeEvent<Error>
type TransactionEvent = DoneInvokeEvent<TransactionResponse>
type Event = ErrorEvent | TransactionEvent

const unstakingMachine = createMachine<Context, Event>(
  {
    initial: "idle",
    context: {
      error: undefined,
      transaction: undefined,
    },
    states: {
      idle: {
        on: {
          UNSTAKE: "waitingConfirmation",
        },
      },
      waitingConfirmation: {
        invoke: {
          src: "unstake",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: {
          UNSTAKE: "waitingConfirmation",
          CLOSE_MODAL: "idle",
        },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        entry: "setTransaction",
        exit: "removeTransaction",
      },
    },
    on: {
      RESET: "idle",
    },
  },
  {
    actions: {
      removeError: assign({ error: undefined }),
      removeTransaction: assign({ transaction: undefined }),
      setError: assign<Context, ErrorEvent>({
        error: (_, event) => event.data,
      }),
      setTransaction: assign<Context, TransactionEvent>({
        transaction: (_, event) => event.data,
      }),
    },
  }
)

const useUnstakingModalMachine = (): Machine<Context> => {
  const {
    chainData: { contractAddress },
  } = useCommunity()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)
  const { account, chainId } = useWeb3React()
  const { unlockedAmount } = useStaked()
  const [state, send] = useMachine(unstakingMachine, {
    services: {
      unstake: async () => {
        const weiAmount = parseEther(unlockedAmount.toString())
        const tx = await contract.withdraw(weiAmount)
        return tx
      },
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, chainId, send])

  return [state, send]
}

export default useUnstakingModalMachine
