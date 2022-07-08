import { hexStripZeros } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import useKeyPair from "hooks/useKeyPair"
import { useState } from "react"
import { ValidationMethod, WalletConnectConnectionData } from "types"
import { bufferToHex, hexToBuffer, strToBuffer } from "utils/bufferUtils"
import useLocalStorage from "../useLocalStorage"

import getFixedTimestamp from "./utils/getFixedTimestamp"
import gnosisSafeSignCallback from "./utils/gnosisSafeSignCallback"

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
  params: {
    method: ValidationMethod
    addr: string
    nonce: string
    hash?: string
    msg: string
    chainId: string
    ts: string
  }
  sig: string
}

const DEFAULT_MESSAGE = "Please sign this message"

const signCallbacks = [
  {
    nameRegex: /Gnosis Safe Multisig/i,
    signCallback: gnosisSafeSignCallback,
    loadingText: "Safe transaction in progress",
  },
]

const getMessage = ({
  msg,
  addr,
  method,
  chainId,
  hash,
  nonce,
  ts,
}: {
  msg: string
  addr: string
  method: ValidationMethod
  chainId: string
  hash?: string
  nonce: string
  ts: string
}) =>
  `${msg}\n\nAddress: ${addr}\nMethod: ${method}${
    chainId ? `\nChainId: ${chainId}` : ""
  }${hash ? `\nHash: ${hash}` : ""}\nNonce: ${nonce}\nTimestamp: ${ts}`

const DEFAULT_SIGN_LOADING_TEXT = "Check your wallet"

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: ({ data: DataType, validation: Validation }) => Promise<ResponseType>,
  {
    message = DEFAULT_MESSAGE,
    forcePrompt = false,
    ...options
  }: Options<ResponseType> & { message?: string; forcePrompt?: boolean } = {
    message: DEFAULT_MESSAGE,
    forcePrompt: false,
  }
) => {
  const { account, provider, chainId } = useWeb3React()
  const [
    {
      peerMeta: { name },
    },
  ] = useLocalStorage<Partial<WalletConnectConnectionData>>("walletconnect", {
    peerMeta: { name: "", url: "", description: "", icons: [] },
  })

  const { keyPair } = useKeyPair()

  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [signLoadingText, setSignLoadingText] = useState<string>(
    DEFAULT_SIGN_LOADING_TEXT
  )

  const useSubmitResponse = useSubmit<DataType, ResponseType>(
    async (data: DataType | Record<string, unknown> = {}) => {
      setIsSigning(true)
      const validation = await sign({
        provider,
        address: account,
        payload: data ?? {},
        chainId: chainId.toString(),
        forcePrompt,
        keyPair,
        msg: message,
      })
        .then(async (val) => {
          const callbackData = signCallbacks.find(({ nameRegex }) =>
            nameRegex.test(name)
          )
          if (callbackData) {
            setSignLoadingText(callbackData.loadingText || DEFAULT_SIGN_LOADING_TEXT)
            const msg = getMessage(val.params)
            await callbackData
              .signCallback(msg, account, provider)
              .finally(() => setSignLoadingText(DEFAULT_SIGN_LOADING_TEXT))
          }
          return val
        })
        .finally(() => setIsSigning(false))

      return fetch({ data: data as DataType, validation })
    },
    options
  )

  return {
    ...useSubmitResponse,
    isSigning,
    signLoadingText: isSigning ? signLoadingText : null,
  }
}

type SignProps = {
  provider: Web3Provider
  address: string
  payload: any
  chainId: string
  forcePrompt: boolean
  keyPair?: CryptoKeyPair
  msg?: string
}

const sign = async ({
  provider,
  address,
  payload,
  chainId: paramChainId,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
}: SignProps): Promise<Validation> => {
  const bytecode = await provider.getCode(address)

  const shouldUseKeyPair = !!keyPair && !forcePrompt

  const isSmartContract = bytecode && hexStripZeros(bytecode) !== "0x"

  const method = isSmartContract
    ? ValidationMethod.EIP1271
    : shouldUseKeyPair
    ? ValidationMethod.KEYPAIR
    : ValidationMethod.STANDARD

  const addr = address.toLowerCase()
  const nonce = randomBytes(32).toString("base64")

  const hash =
    Object.keys(payload).length > 0
      ? keccak256(toUtf8Bytes(stringify(payload)))
      : undefined
  const ts = await getFixedTimestamp().catch(() => Date.now().toString())

  const chainId = method === ValidationMethod.EIP1271 ? paramChainId : undefined

  const message = getMessage({ msg, addr, method, chainId, hash, nonce, ts })

  const sig = await (method === ValidationMethod.KEYPAIR
    ? window.crypto.subtle
        .sign(
          { name: "ECDSA", hash: "SHA-512" },
          keyPair.privateKey,
          strToBuffer(message)
        )
        .then((signatureBuffer) => bufferToHex(signatureBuffer))
    : provider.getSigner(address.toLowerCase()).signMessage(message))

  // This whole if is just for debugging, can be deleted once we can verify on the nodejs side
  if (method === ValidationMethod.KEYPAIR) {
    const verifyResult = await window.crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-512" },
      keyPair.publicKey,
      hexToBuffer(sig),
      strToBuffer(message)
    )

    const pubKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)

    console.log("Params used for verify:", {
      sig,
      message,
      pubKeyObj: keyPair.publicKey,
      pubKey,
      pubKeyStr: JSON.stringify(pubKey),
    })
    console.log("verifyResult:", verifyResult)
  }

  return { params: { chainId, msg, method, addr, nonce, hash, ts }, sig }
}

export default useSubmit
export { useSubmitWithSign, sign }

/*
window.crypto.subtle.importKey(
  "spki",
  key,
  {
    name: "ECDSA",
    namedCurve: "P-256",
  },
  true,
  ["verify"]
)

window.crypto.subtle
          .verify(
            { name: "ECDSA", hash: "SHA-512" },
            keyPair.publicKey,
            hexToBuffer(signature),
            strToBuffer(message)
          )
          .then((result) => {
            console.log("Result:", result)
          })

*/
