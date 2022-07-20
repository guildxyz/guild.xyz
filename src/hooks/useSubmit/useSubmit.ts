import { keccak256 } from "@ethersproject/keccak256"
import { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import { useState } from "react"
import { ValidationMethod, WalletConnectConnectionData } from "types"
import fetcher from "utils/fetcher"
import useLocalStorage from "../useLocalStorage"

import gnosisSafeSignCallback, {
  MethodSignCallback,
} from "./utils/gnosisSafeSignCallback"

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

const methodPeerMetaDatas = {
  [ValidationMethod.EIP1271]: [
    {
      urlPrefix: "https://wallet.ambire.com",
      nameRegex: /Ambire Wallet/i,
    },
    {
      urlPrefix: "https://apps.gnosis-safe.io",
      nameRegex: /Gnosis Safe Multisig/i,
      signCallback: gnosisSafeSignCallback,
      callbackLoadingText: "Safe transaction in progress",
    },
  ],
}

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
    ...options
  }: Options<ResponseType> & { message?: string } = { message: DEFAULT_MESSAGE }
) => {
  const { account, provider, chainId, connector } = useWeb3React()
  const [
    {
      peerMeta: { name, url },
    },
  ] = useLocalStorage<Partial<WalletConnectConnectionData>>("walletconnect", {
    peerMeta: { name: "", url: "", description: "", icons: [] },
  })

  const isWalletConnect = connector instanceof WalletConnect

  const [method, signCallback, callbackLoadingText] = Object.entries(
    methodPeerMetaDatas
  ).reduce<[number, MethodSignCallback, string]>(
    (acc, [methodId, metaDatas]) => {
      if (!!acc[0]) return acc
      const wallet = metaDatas.find(
        ({ urlPrefix, nameRegex }) =>
          url.startsWith(urlPrefix) && nameRegex.test(name)
      )
      if (wallet) {
        return [+methodId, wallet.signCallback, wallet.callbackLoadingText]
      }
      return acc
    },
    [undefined, undefined, undefined]
  )

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
        chainId:
          method === ValidationMethod.STANDARD ? undefined : chainId.toString(),
        method: isWalletConnect
          ? method ?? ValidationMethod.STANDARD
          : ValidationMethod.STANDARD,
        msg: message,
      })
        .catch((error) => {
          console.error(error)
          throw error
        })
        .then(async (val) => {
          if (signCallback) {
            setSignLoadingText(callbackLoadingText || DEFAULT_SIGN_LOADING_TEXT)
            const msg = getMessage(val.params)
            await signCallback(msg, account, provider).finally(() =>
              setSignLoadingText(DEFAULT_SIGN_LOADING_TEXT)
            )
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
  method: ValidationMethod
  msg: string
}

const sign = async ({
  provider,
  address,
  payload,
  chainId,
  method,
  msg,
}: SignProps): Promise<Validation> => {
  const addr = address.toLowerCase()
  const nonce = randomBytes(32).toString("base64")

  const hash =
    Object.keys(payload).length > 0
      ? keccak256(toUtf8Bytes(stringify(payload)))
      : undefined
  const ts = await fetcher("/api/timestamp").catch(() => Date.now().toString())

  const message = getMessage({ msg, addr, method, chainId, hash, nonce, ts })

  const sig = await provider.getSigner(addr).signMessage(message)

  return { params: { chainId, msg, method, addr, nonce, hash, ts }, sig }
}

export default useSubmit
export { useSubmitWithSign }
