import { keccak256 } from "@ethersproject/keccak256"
import type { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import { useState } from "react"

type Options<ResponseType> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

const useSubmit = <DataType, ResponseType>(
  fetch: (data?: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: Options<ResponseType> = {}
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)
  const [response, setResponse] = useState<ResponseType>(undefined)

  return {
    onSubmit: (data?: DataType) => {
      setIsLoading(true)
      setError(undefined)
      fetch(data)
        .then((d) => {
          onSuccess?.(d)
          setResponse(d)
        })
        .catch((e) => {
          onError?.(e)
          setError(e)
        })
        .finally(() => setIsLoading(false))
    },
    response,
    isLoading,
    error,
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
    async (data: DataType | Record<string, unknown> = {}) => {
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
