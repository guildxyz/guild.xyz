import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useRef } from "react"
import createFetchMachine from "./utils/fetchMachine"

type Options<ResponseType> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

const useSubmit = <DataType, ResponseType>(
  fetch: (data: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: Options<ResponseType> = {}
) => {
  // xState does not support passing different objects on different renders,
  // using a ref here, so we have the same object on all renders
  const machine = useRef(createFetchMachine<DataType, ResponseType>())
  const [state, send] = useMachine(machine.current, {
    services: {
      fetch: (_context, event) => {
        // needed for typescript to ensure that event always has data property
        if (event.type !== "FETCH") return
        return fetch(event.data)
      },
    },
    actions: {
      onSuccess: (context) => {
        onSuccess?.(context.response)
      },
      onError: async (context) => {
        const err = await context.error
        onError?.(err)
      },
    },
  })

  return {
    ...state.context,
    onSubmit: (data?: DataType) => send({ type: "FETCH", data }),
    isLoading: state.matches("fetching"),
  }
}

export type ValidationData = {
  address: string
  library: Web3Provider
}

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: (data: DataType, validationData: ValidationData) => Promise<ResponseType>,
  options: Options<ResponseType> = {}
) => {
  const { account, library } = useWeb3React()

  return useSubmit<DataType, ResponseType>(
    (props) => fetch(props, { address: account, library }),
    options
  )
}

export default useSubmit
export { useSubmitWithSign }
