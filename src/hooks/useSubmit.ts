import { keccak256 } from "@ethersproject/keccak256"
import type { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import { useState } from "react"
import { WalletConnectConnectionData } from "types"
import useLocalStorage from "./useLocalStorage"

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

const validationMethods = {
  "1": {
    key: "secp256k1",
    wallet: "standard",
  },
  "2": {
    key: "secp521r1",
    wallet: "browser",
  },
  "3": {
    key: "secp256k1",
    wallet: "ambire",
  },
  "4": {
    key: "secp256k1",
    wallet: "gnosis",
  },
}

type ValidationMethod = typeof validationMethods

export type Validation = {
  params: {
    method: keyof ValidationMethod
    address: string
    nonce: string
    hash?: string
    msg: string
    chainId: string
    ts: string
  }
  sig: string
}

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: ({ data: DataType, validation: Validation }) => Promise<ResponseType>,
  options: Options<ResponseType> = {}
) => {
  const { account, provider, chainId, connector } = useWeb3React()
  const [{ peerMeta }] = useLocalStorage<Partial<WalletConnectConnectionData>>(
    "walletconnect",
    {}
  )

  const isWalletConnect = connector instanceof WalletConnect
  const isAmbireWallet = [peerMeta?.name, peerMeta?.url].every((str) =>
    /ambire/i.test(str)
  )
  const isAmbireMethod = isWalletConnect && isAmbireWallet

  const method = (isAmbireMethod && "3") || "1"

  const [isSigning, setIsSigning] = useState<boolean>(false)

  const useSubmitResponse = useSubmit<DataType, ResponseType>(
    async (data: DataType | Record<string, unknown> = {}) => {
      setIsSigning(true)
      const validation = await sign({
        provider,
        address: account,
        payload: data ?? {},
        chainId: chainId.toString(),
        method,
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
  method: keyof ValidationMethod
}

const sign = async ({
  provider,
  address,
  payload,
  chainId,
  method,
}: SignProps): Promise<Validation> => {
  const addr = address.toLowerCase()
  const nonce = randomBytes(32).toString("base64")

  const hash =
    Object.keys(payload).length > 0 ? keccak256(toUtf8Bytes(stringify(payload))) : ""
  const ts = new Date().getTime().toString()

  const msg = "Please sign this message"

  const sig = await provider
    .getSigner(address.toLowerCase())
    .signMessage(
      `${msg}\n\nAddress: ${addr}\nMethod: ${method}\nChainId: ${chainId}\nHash: ${hash}\nNonce: ${nonce}\nTimestamp: ${ts}`
    )

  return {
    params: {
      chainId,
      msg,
      method,
      address: address.toLowerCase(),
      nonce,
      ...(hash.length > 0 ? { hash } : {}),
      ts,
    },
    sig,
  }
}

export default useSubmit
export { useSubmitWithSign }
