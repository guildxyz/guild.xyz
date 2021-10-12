import { useMachine } from "@xstate/react"
import usePersonalSign from "hooks/usePersonalSign"
import createFetchMachine from "./utils/fetchMachine"

type Options<ResponseType> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

const useSubmit = <DataType, ResponseType>(
  fetch: (data: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: Options<ResponseType> = {}
) => {
  const { callbackWithSign } = usePersonalSign(true)
  const [state, send] = useMachine(createFetchMachine<DataType, ResponseType>(), {
    services: {
      fetch: (_context, event) => {
        if (event.type !== "FETCH") return
        return fetch(event.data)
      },
    },
    actions: {
      onSuccess: (context) => {
        onSuccess?.(context.response)
      },
      onError: (_context, event: any) => {
        onError?.(event?.data)
      },
    },
  })

  return {
    ...state.context,
    onSubmit: (data?: DataType) =>
      callbackWithSign(() => send({ type: "FETCH", data }))(),
    isLoading: state.matches("fetching"),
  }
}

export default useSubmit
