import { TransactionRequest } from "@ethersproject/providers"
import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type ContextType = {
  error: any
  transaction: TransactionRequest | null
}

const stakingMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
      transaction: null,
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
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
      removeTransaction: assign<ContextType, DoneInvokeEvent<any>>({
        transaction: null,
      }),
      setTransaction: assign<ContextType, DoneInvokeEvent<any>>({
        transaction: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useStakingMachine = (amount: number): any => {
  const {
    chainData: { contractAddress },
  } = useCommunity()
  const { account, chainId } = useWeb3React()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)

  const [state, send] = useMachine<any, any>(stakingMachine, {
    services: {
      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx = await contract.deposit(weiAmount)
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
