import { keccak256 } from "@ethersproject/keccak256"
import type { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import { useRef, useState } from "react"
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

export type WithValidation<D> = { data: D; validation: ValidationData }

export type Validation = {
  address: string
  addressSignedMessage: string
  nonce: string
  random: string
  hash?: string
  timestamp: string
}

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: ({ data: DataType, validation: Validation }) => Promise<ResponseType>,
  options: Options<ResponseType> = {}
) => {
  const { account, library } = useWeb3React()
  const [isSigning, setIsSigning] = useState<boolean>(false)

  const useSubmitResponse = useSubmit<DataType, ResponseType>(
    async (data: any = {}) => {
      setIsSigning(true)
      const validation = await sign({
        library,
        address: account,
        payload: data ?? {},
      }).finally(() => setIsSigning(false))

      return fetch({ data: data as DataType, validation })
    },
    options
  )

  return { ...useSubmitResponse, isSigning }
}

const sign = async ({
  library,
  address,
  payload,
}: {
  library: Web3Provider
  address: string
  payload: any
}): Promise<Validation> => {
  const random = randomBytes(32).toString("base64")
  const nonce = keccak256(toUtf8Bytes(`${address.toLowerCase()}${random}`))

  const hash =
    Object.keys(payload).length > 0 ? keccak256(toUtf8Bytes(stringify(payload))) : ""
  const timestamp = new Date().getTime().toString()

  const addressSignedMessage = await library
    .getSigner(address.toLowerCase())
    .signMessage(
      `Please sign this message to verify your request!\nNonce: ${nonce}\nRandom: ${random}\n${
        hash ? `Hash: ${hash}\n` : ""
      }Timestamp: ${timestamp}`
    )

  return {
    address: address.toLowerCase(),
    addressSignedMessage,
    nonce,
    random,
    ...(hash.length > 0 ? { hash } : {}),
    timestamp,
  }
}

export default useSubmit
export { useSubmitWithSign }
