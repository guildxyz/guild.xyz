import { keccak256 } from "@ethersproject/keccak256"
import { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import { useState } from "react"
import { ValidationMethod, WalletConnectConnectionData } from "types"
import useLocalStorage from "../useLocalStorage"

import getFixedTimestamp from "./utils/getFixedTimestamp"
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
    },
  ],
}

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

  const [method, signCallback] = Object.entries(methodPeerMetaDatas).reduce<
    [number, MethodSignCallback]
  >(
    (acc, [methodId, metaDatas]) => {
      if (!!acc[0]) return acc
      const wallet = metaDatas.find(
        ({ urlPrefix, nameRegex }) =>
          url.startsWith(urlPrefix) && nameRegex.test(name)
      )
      if (wallet) {
        return [+methodId, wallet.signCallback]
      }
      return acc
    },
    [undefined, undefined]
  )

  const [isSigning, setIsSigning] = useState<boolean>(false)

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
        signCallback,
      }).finally(() => setIsSigning(false))

      return fetch({ data: data as DataType, validation })
    },
    options
  )

  return { ...useSubmitResponse, isSigning }
}

type SignProps = {
  provider: Web3Provider
  address: string
  payload: any
  chainId: string
  method: ValidationMethod
  msg: string
  signCallback: MethodSignCallback
}

const sign = async ({
  provider,
  address,
  payload,
  chainId,
  method,
  msg,
  signCallback,
}: SignProps): Promise<Validation> => {
  const addr = address.toLowerCase()
  const nonce = randomBytes(32).toString("base64")

  const hash =
    Object.keys(payload).length > 0 ? keccak256(toUtf8Bytes(stringify(payload))) : ""
  const ts = await getFixedTimestamp().catch(() => Date.now().toString())

  const message = `${msg}\n\nAddress: ${addr}\nMethod: ${method}${
    chainId ? `\nChainId: ${chainId}` : ""
  }${hash.length > 0 ? `\nHash: ${hash}` : ""}\nNonce: ${nonce}\nTimestamp: ${ts}`

  const sig = await provider.getSigner(address.toLowerCase()).signMessage(message)

  await signCallback?.(message, address, provider)

  return {
    params: {
      chainId,
      msg,
      method,
      addr: address.toLowerCase(),
      nonce,
      ...(hash.length > 0 ? { hash } : {}),
      ts,
    },
    sig,
  }
}

export default useSubmit
export { useSubmitWithSign }
