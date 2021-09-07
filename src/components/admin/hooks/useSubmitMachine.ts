import { useMachine } from "@xstate/react"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useToast from "hooks/useToast"
import type { Level } from "pages/[community]/admin/community"
import createSubmitMachine, {
  APIError,
  ContextType,
  InitialEvent,
  SignError,
  SignEvent,
} from "../utils/submitMachine"
import useShowErrorToast from "./useShowErrorToast"

const useSubmitMachine = <FormDataType>(
  successText: string,
  fetch: (
    _context: ContextType,
    {
      data,
    }: SignEvent<
      FormDataType & {
        levels: Level[]
      }
    >
  ) => Promise<Response | Response[]>,
  redirect: (context: ContextType) => Promise<void>,
  preprocess: (data: FormDataType) => FormDataType = (data) => data
) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const sign = usePersonalSign()
  const [state, send] = useMachine(createSubmitMachine<FormDataType>(), {
    services: {
      fetch,
      sign: async (_, { data }: InitialEvent<FormDataType>) => {
        const addressSignedMessage = await sign(
          "Please sign this message to verify your address"
        ).catch(() =>
          Promise.reject(
            new Error("You must sign the message to verify your address!")
          )
        )
        return { ...data, addressSignedMessage }
      },
    },
    actions: {
      redirect,
      showErrorToast: (_context, { data: error }: SignError | APIError) => {
        if (error instanceof Error) showErrorToast(error.message)
        else showErrorToast(error.errors)
      },
      showSuccessToast: () => {
        if (successText !== null)
          toast({
            title: "Success!",
            description: successText,
            status: "success",
            duration: 2000,
          })
      },
    },
  })

  const onSubmit = (_data: FormDataType) => {
    const data = preprocess(_data)
    send("SIGN", { data })
  }

  return { onSubmit, loading: ["sign", "fetch", "parseError"].some(state.matches) }
}

export default useSubmitMachine
