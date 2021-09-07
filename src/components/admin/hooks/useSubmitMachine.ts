import { useMachine } from "@xstate/react"
import { usePersonalSign } from "components/_app/PersonalSignStore"
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

const MESSAGE = "You must sign the message to verify your address!"

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
  const [sign, hasMessage, getSign] = usePersonalSign()
  const [state, send] = useMachine(createSubmitMachine<FormDataType>(), {
    services: {
      fetch,
      sign: async (_, { data }: InitialEvent<FormDataType>) => {
        if (hasMessage(MESSAGE))
          return { ...data, addressSignedMessage: getSign(MESSAGE) }
        const addressSignedMessage = await sign(MESSAGE).catch(() =>
          Promise.reject(new Error())
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
