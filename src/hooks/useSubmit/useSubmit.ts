import { hexStripZeros } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { randomBytes } from "crypto"
import useKeyPair from "hooks/useKeyPair"
import useLocalStorage from "hooks/useLocalStorage"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"
import { useState } from "react"
import useSWR from "swr"
import { ValidationMethod } from "types"
import { bufferToHex, strToBuffer } from "utils/bufferUtils"
import gnosisSafeSignCallback from "./utils/gnosisSafeSignCallback"

export type UseSubmitOptions<ResponseType = void> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

type FetcherFunction<ResponseType> = ({
  signedPayload,
  validation,
}: {
  signedPayload: string
  validation: Validation
}) => Promise<ResponseType>

const useSubmit = <DataType, ResponseType>(
  fetch: (data?: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: UseSubmitOptions<ResponseType> = {}
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
    reset: () => {
      setIsLoading(false)
      setError(undefined)
      setResponse(undefined)
    },
  }
}

export type SignedValdation = { signedPayload: string; validation: Validation }

export type Validation = {
  params: MessageParams
  sig: string
}

const DEFAULT_MESSAGE = "Please sign this message"

const signCallbacks = [
  {
    domain: "safe.global",
    signCallback: gnosisSafeSignCallback,
    loadingText: "Safe transaction in progress",
  },
]

type MessageParams = {
  msg: string
  addr: string
  method: ValidationMethod
  chainId?: string
  hash?: string
  nonce: string
  ts: string
}

const getMessage = ({
  msg,
  addr,
  method,
  chainId,
  hash,
  nonce,
  ts,
}: MessageParams) =>
  `${msg}\n\nAddress: ${addr}\nMethod: ${method}${
    chainId ? `\nChainId: ${chainId}` : ""
  }${hash ? `\nHash: ${hash}` : ""}\nNonce: ${nonce}\nTimestamp: ${ts}`

const DEFAULT_SIGN_LOADING_TEXT = "Check your wallet"

const useSubmitWithSignWithParamKeyPair = <DataType, ResponseType>(
  fetch: FetcherFunction<ResponseType>,
  {
    message = DEFAULT_MESSAGE,
    forcePrompt = false,
    keyPair,
    ...options
  }: UseSubmitOptions<ResponseType> & {
    message?: string
    forcePrompt?: boolean
    keyPair: CryptoKeyPair
  } = {
    message: DEFAULT_MESSAGE,
    forcePrompt: false,
    keyPair: undefined,
  }
) => {
  const { account, provider, chainId } = useWeb3React()
  const { data: peerMeta } = useSWR<any>(
    typeof window !== "undefined" ? "walletConnectPeerMeta" : null,
    () => JSON.parse(window.localStorage.getItem("walletconnect")).peerMeta,
    { refreshInterval: 200, revalidateOnMount: true }
  )

  const timeInaccuracy = useTimeInaccuracy()
  const [, setShouldFetchTimestamp] = useLocalStorage("shouldFetchTimestamp", false)

  const defaultLoadingText =
    forcePrompt || !keyPair ? DEFAULT_SIGN_LOADING_TEXT : undefined

  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [signLoadingText, setSignLoadingText] = useState<string>(defaultLoadingText)

  const useSubmitResponse = useSubmit<DataType, ResponseType>(
    async (data: DataType | Record<string, unknown> = {}) => {
      const payload = JSON.stringify(data ?? {})
      setSignLoadingText(defaultLoadingText)
      setIsSigning(true)
      const [signedPayload, validation] = await sign({
        provider,
        address: account,
        payload,
        chainId: chainId.toString(),
        forcePrompt,
        keyPair,
        msg: message,
        ts: Date.now() + timeInaccuracy,
      })
        .then(async ([signed, val]) => {
          const callbackData = signCallbacks.find(({ domain }) =>
            peerMeta?.url?.includes?.(domain)
          )
          if ((forcePrompt || !keyPair) && callbackData) {
            setSignLoadingText(callbackData.loadingText || defaultLoadingText)
            const msg = getMessage(val.params)
            await callbackData
              .signCallback(msg, account, chainId)
              .finally(() => setSignLoadingText(defaultLoadingText))
          }
          return [signed, val] as [string, Validation]
        })
        .finally(() => setIsSigning(false))

      return fetch({ signedPayload, validation }).catch((e) => {
        if (e?.message === "Invalid or expired timestamp!") {
          setShouldFetchTimestamp(true)
          location?.reload()
        }

        throw e
      })
    },
    options
  )

  return {
    ...useSubmitResponse,
    isSigning,
    signLoadingText: isSigning ? signLoadingText : null,
  }
}

const useSubmitWithSign = <ResponseType>(
  fetch: FetcherFunction<ResponseType>,
  {
    message = DEFAULT_MESSAGE,
    forcePrompt = false,
    ...options
  }: UseSubmitOptions<ResponseType> & {
    message?: string
    forcePrompt?: boolean
  } = {
    message: DEFAULT_MESSAGE,
    forcePrompt: false,
  }
) => {
  const { keyPair } = useKeyPair()
  return useSubmitWithSignWithParamKeyPair(fetch, {
    message,
    forcePrompt,
    ...options,
    keyPair,
  })
}

export type SignProps = {
  provider: Web3Provider
  address: string
  payload: string
  chainId: string
  forcePrompt: boolean
  keyPair?: CryptoKeyPair
  msg?: string
  ts: number
}

const sign = async ({
  provider,
  address,
  payload,
  chainId: paramChainId,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
  ts,
}: SignProps): Promise<[string, Validation]> => {
  const params: MessageParams = {
    addr: address.toLowerCase(),
    nonce: randomBytes(32).toString("base64"),
    ts: ts.toString(),
    hash: payload !== "{}" ? keccak256(toUtf8Bytes(payload)) : undefined,
    method: null,
    msg,
    chainId: undefined,
  }
  let sig = null

  if (!!keyPair && !forcePrompt) {
    params.method = ValidationMethod.KEYPAIR
    sig = await window.crypto.subtle
      .sign(
        { name: "ECDSA", hash: "SHA-512" },
        keyPair.privateKey,
        strToBuffer(getMessage(params))
      )
      .then((signatureBuffer) => bufferToHex(signatureBuffer))
  } else {
    const rpcUrl = RPC[Chains[paramChainId]]?.rpcUrls?.[0]
    const prov =
      typeof rpcUrl === "string" && rpcUrl.length > 0
        ? new JsonRpcProvider(rpcUrl)
        : provider

    const bytecode = await prov.getCode(address).catch(() => null)

    const isSmartContract = bytecode && hexStripZeros(bytecode) !== "0x"

    params.method = isSmartContract
      ? ValidationMethod.EIP1271
      : ValidationMethod.STANDARD

    if (isSmartContract) {
      params.chainId = paramChainId
    }

    sig = await provider
      .getSigner(address.toLowerCase())
      .signMessage(getMessage(params))
  }

  return [payload, { params, sig }]
}

export default useSubmit
export { useSubmitWithSignWithParamKeyPair, sign, useSubmitWithSign }
