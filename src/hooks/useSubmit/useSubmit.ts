import { useWallet } from "@fuel-wallet/react"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { type WalletUnlocked } from "fuels"
import useLocalStorage from "hooks/useLocalStorage"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"
import randomBytes from "randombytes"
import { useCallback, useState } from "react"
import useSWR from "swr"
import { ValidationMethod } from "types"
import {
  PublicClient,
  UnauthorizedProviderError,
  WalletClient,
  createPublicClient,
  keccak256,
  stringToBytes,
  trim,
} from "viem"
import { useChainId, usePublicClient, useWalletClient } from "wagmi"
import { wagmiConfig } from "wagmiConfig"
import { Chain, Chains, supportedChains } from "wagmiConfig/chains"
import gnosisSafeSignCallback from "./utils/gnosisSafeSignCallback"

export type UseSubmitOptions<ResponseType = void> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void

  // Use catefully! If this is set to true, a .onSubmit() call can reject!
  allowThrow?: boolean
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
  { onSuccess, onError, allowThrow }: UseSubmitOptions<ResponseType> = {}
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)
  const [response, setResponse] = useState<ResponseType>(undefined)

  const onSubmit = useCallback(
    (data?: DataType): Promise<ResponseType> => {
      setIsLoading(true)
      setError(undefined)
      return fetch(data)
        .then((d) => {
          onSuccess?.(d)
          setResponse(d)
          return d
        })
        .catch((e) => {
          onError?.(e)
          setError(e)
          if (allowThrow) {
            throw e
          }
          return null
        })
        .finally(() => setIsLoading(false))
    },
    [allowThrow, fetch, onError, onSuccess]
  )

  return {
    onSubmit,
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

export type SignedValidation = { signedPayload: string; validation: Validation }

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

  const { address, type } = useWeb3ConnectionManager()

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId()

  const { wallet: fuelWallet } = useWallet()

  const useSubmitResponse = useSubmit<DataType, ResponseType>(
    async ({
      signProps: _signProps,
      ...data
    }: (DataType | Record<string, unknown>) & { signProps?: SignProps } = {}) => {
      const payload = JSON.stringify(data ?? {})
      setSignLoadingText(defaultLoadingText)
      setIsSigning(true)

      const [signedPayload, validation] = await (type === "EVM"
        ? sign({
            publicClient,
            walletClient,
            address,
            payload,
            chainId: chainId.toString(),
            forcePrompt,
            keyPair,
            msg: message,
            ts: Date.now() + timeInaccuracy,
          })
        : fuelSign({
            wallet: fuelWallet,
            address,
            payload,
            forcePrompt,
            keyPair,
            msg: message,
            ts: Date.now() + timeInaccuracy,
          })
      )
        .then(async ([signed, val]) => {
          const callbackData = signCallbacks.find(({ domain }) =>
            peerMeta?.url?.includes?.(domain)
          )
          if ((forcePrompt || !keyPair) && callbackData) {
            setSignLoadingText(callbackData.loadingText || defaultLoadingText)
            const msg = getMessage(val.params)
            await callbackData
              .signCallback(msg, address, chainId)
              .finally(() => setSignLoadingText(defaultLoadingText))
          }
          return [signed, val] as [string, Validation]
        })
        .finally(() => setIsSigning(false))

      return fetch({ signedPayload, validation }).catch((e) => {
        if (
          e?.errors?.[0]?.msg === "Invalid or expired timestamp!" ||
          e?.errors?.[0]?.msg ===
            "Invalid timestamp! The creation of timestamp too far in future!"
        ) {
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
  const { keyPair } = useUserPublic()
  return useSubmitWithSignWithParamKeyPair(fetch, {
    message,
    forcePrompt,
    ...options,
    keyPair: keyPair?.keyPair,
  })
}

type SignBaseProps = {
  address: `0x${string}`
  payload: string
  chainId?: string
  forcePrompt: boolean
  keyPair?: CryptoKeyPair
  msg?: string
  ts?: number
}

export type SignProps = SignBaseProps & {
  publicClient: PublicClient
  walletClient: WalletClient
}

export type FuelSignProps = SignBaseProps & { wallet: WalletUnlocked }

const createMessageParams = (
  address: `0x${string}`,
  ts: number,
  msg: string,
  payload: string
): MessageParams => ({
  addr: address.toLowerCase(),
  nonce: randomBytes(32).toString("base64"),
  ts: ts.toString(),
  hash: payload !== "{}" ? keccak256(stringToBytes(payload)) : undefined,
  method: null,
  msg,
  chainId: undefined,
})

const signWithKeyPair = (keyPair: CryptoKeyPair, params: MessageParams) =>
  window.crypto.subtle
    .sign(
      { name: "ECDSA", hash: "SHA-512" },
      keyPair.privateKey,
      Buffer.from(getMessage(params))
    )
    .then((signatureBuffer) => Buffer.from(signatureBuffer).toString("hex"))

export const fuelSign = async ({
  wallet,
  address,
  payload,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
  ts,
}: FuelSignProps): Promise<[string, Validation]> => {
  const params = createMessageParams(address, ts, msg, payload)
  let sig = null

  if (!!keyPair && !forcePrompt) {
    params.method = ValidationMethod.KEYPAIR
    sig = await signWithKeyPair(keyPair, params)
  } else {
    params.method = ValidationMethod.FUEL
    sig = await wallet.signMessage(getMessage(params))
  }

  return [payload, { params, sig }]
}

const chainsOfAddressWithDeployedContract = async (
  address: `0x${string}`
): Promise<Chain[]> => {
  const LOCALSTORAGE_KEY = `chainsWithByteCode_${address.toLowerCase()}`
  const chainsWithByteCodeFromLocalstorage = localStorage.getItem(LOCALSTORAGE_KEY)

  if (chainsWithByteCodeFromLocalstorage) {
    const parsed = JSON.parse(chainsWithByteCodeFromLocalstorage)

    if (Array.isArray(parsed))
      return parsed.filter((c) => supportedChains.includes(c))
  }

  const res = await Promise.all(
    wagmiConfig.chains.map(async (chain) => {
      const publicClient = createPublicClient({
        chain,
        transport: wagmiConfig._internal.transports[chain.id],
      })

      const bytecode = await publicClient
        .getBytecode({
          address,
        })
        .catch(() => null)

      return [Chains[chain.id], bytecode && trim(bytecode) !== "0x"] as const
    })
  ).then((results) => [
    ...new Set(
      results
        .filter(([, hasContract]) => !!hasContract)
        .map(([chainName]) => chainName as Chain)
    ),
  ])

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(res))

  return res
}

export const sign = async ({
  walletClient,
  address,
  payload,
  chainId,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
  ts,
}: SignProps): Promise<[string, Validation]> => {
  const params = createMessageParams(address, ts ?? Date.now(), msg, payload)
  let sig = null

  if (!!keyPair && !forcePrompt) {
    params.method = ValidationMethod.KEYPAIR
    sig = await signWithKeyPair(keyPair, params)
  } else {
    const walletChains = await chainsOfAddressWithDeployedContract(address)
    const walletChainId =
      walletChains.length > 0 ? Chains[walletChains[0]] : undefined

    if (walletChainId) {
      if (walletClient.chain.id !== walletChainId) {
        await walletClient.switchChain({ id: walletChainId })
      }
      params.chainId = `${walletChainId}`
    }

    const isSmartContract = walletChains.length > 0

    params.method = isSmartContract
      ? ValidationMethod.EIP1271
      : ValidationMethod.STANDARD

    if (isSmartContract) {
      params.chainId = chainId
    }

    if (walletClient?.account?.type === "local") {
      // For local accounts, such as CWaaS, we request the signature on the account. Otherwise it sends a personal_sign to the rpc
      sig = await walletClient.account.signMessage({
        message: getMessage(params),
      })
    } else {
      sig = await walletClient
        .signMessage({
          account: address,
          message: getMessage(params),
        })
        .catch((error) => {
          if (error instanceof UnauthorizedProviderError) {
            throw new Error(
              "Your wallet is not connected. It might be because your browser locked it after a period of time."
            )
          }
          throw error
        })
    }
  }

  return [payload, { params, sig }]
}

export default useSubmit
export { useSubmitWithSign, useSubmitWithSignWithParamKeyPair }
