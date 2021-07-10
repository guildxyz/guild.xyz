import { TransactionRequest } from "@ethersproject/providers"
import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import useStaked from "components/community/Staked/hooks/useStaked"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type ContextType = {
  error: Error | null
  transaction: TransactionRequest | null
}

const unstakingMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
      transaction: null,
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
      removeError: assign<ContextType, DoneInvokeEvent<any>>({ error: null }),
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

const useUnstakingModalMachine = (): any => {
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
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
