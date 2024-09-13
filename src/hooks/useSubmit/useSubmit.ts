import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useUserPublic } from "@/hooks/useUserPublic"
import { useWallet } from "@fuels/react"
import useLocalStorage from "hooks/useLocalStorage"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"
import { useCallback, useState } from "react"
import useSWR from "swr"
import { useChainId, usePublicClient, useWalletClient } from "wagmi"
import { DEFAULT_MESSAGE, DEFAULT_SIGN_LOADING_TEXT } from "./constants"
import { SignProps, UseSubmitOptions, Validation } from "./types"
import { fuelSign, getMessage, sign } from "./utils"
import gnosisSafeSignCallback from "./utils/gnosisSafeSignCallback"

type FetcherFunction<ResponseType> = ({
  signedPayload,
  validation,
}: {
  signedPayload: string
  validation: Validation
}) => Promise<ResponseType>

const useSubmit = <DataType, ResponseType>(
  fetch: (data?: DataType) => Promise<ResponseType>,
  {
    onSuccess,
    onError,
    allowThrow,
    onOptimistic,
  }: UseSubmitOptions<ResponseType> = {}
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)
  const [response, setResponse] = useState<ResponseType>(undefined)

  const onSubmit = useCallback(
    (data?: DataType): Promise<ResponseType> => {
      setIsLoading(true)
      setError(undefined)
      const response = fetch(data)
      onOptimistic?.(response, data)
      return response
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
    [allowThrow, fetch, onError, onSuccess, onOptimistic]
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

const signCallbacks = [
  {
    domain: "safe.global",
    signCallback: gnosisSafeSignCallback,
    loadingText: "Safe transaction in progress",
  },
]

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

export default useSubmit
export { useSubmitWithSign, useSubmitWithSignWithParamKeyPair }
