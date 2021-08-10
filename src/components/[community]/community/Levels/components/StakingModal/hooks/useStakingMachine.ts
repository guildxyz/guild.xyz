import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import type { Machine, MetaMaskError } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type Context = {
  error?: MetaMaskError
  transaction?: TransactionResponse
}

type ErrorEvent = DoneInvokeEvent<MetaMaskError>
type TransactionEvent = DoneInvokeEvent<TransactionResponse>
type Event = ErrorEvent | TransactionEvent

const stakingMachine = createMachine<Context, Event>(
  {
    initial: "idle",
    context: {
      error: undefined,
      transaction: undefined,
    },
    states: {
      idle: {
        on: {
          STAKE: "waitingConfirmation",
        },
      },
      waitingConfirmation: {
        invoke: {
          src: "stake",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: {
          STAKE: "waitingConfirmation",
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

const useStakingMachine = (amount: number): Machine<Context> => {
  const {
    chainData: { contractAddress },
  } = useCommunity()
  const { account, chainId } = useWeb3React()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)

  const [state, send] = useMachine<Context, Event>(stakingMachine, {
    services: {
      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx: TransactionResponse = await contract.deposit(weiAmount)
        return tx
      },
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, chainId, send])

  return [state, send]
}

export default useStakingMachine
