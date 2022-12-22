import { datadogRum } from "@datadog/browser-rum"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useKeyPair from "hooks/useKeyPair"
import { sign } from "hooks/useSubmit"
import { SignProps } from "hooks/useSubmit/useSubmit"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"

const fetcher = async (
  resource: string,
  { body, validation, ...init }: Record<string, any> = {}
) => {
  const isGuildApiCall = !resource.startsWith("http") && !resource.startsWith("/api")
  const isServerless = resource.startsWith("/api")

  const api = isGuildApiCall ? process.env.NEXT_PUBLIC_API : ""

  const payload = body ?? {}

  const options = {
    ...(body
      ? {
          method: "POST",
          body: JSON.stringify(
            validation
              ? {
                  payload,
                  ...validation,
                }
              : body
          ),
        }
      : {}),
    ...init,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  }

  if (isGuildApiCall || isServerless)
    datadogRum?.addAction(`FETCH ${resource}`, {
      url: `${api}${resource}`,
      options,
      userAddress: resource.includes("checkPubKey")
        ? body.address?.toLowerCase()
        : undefined,
    })

  return fetch(`${api}${resource}`, options)
    .catch((err) => {
      datadogRum?.addError("Failed to fetch", {
        url: `${api}${resource}`,
        error: err?.message || err?.toString?.() || err,
      })
      throw err
    })
    .then(async (response: Response) => {
      const res = await response.json?.()

      if (!response.ok) {
        if (isGuildApiCall) {
          const error = res.errors?.[0]
          const errorMsg = error
            ? `${error.msg}${error.param ? ` : ${error.param}` : ""}`
            : res

          datadogRum?.addError(
            !error && resource.startsWith("/guild/access")
              ? "Access check error(s)"
              : "FETCH ERROR",
            {
              url: `${api}${resource}`,
              response: errorMsg,
            }
          )

          return Promise.reject(errorMsg)
        }

        return Promise.reject(res)
      }

      return res
    })
}

const fetcherWithSign = async (
  signProps: Omit<SignProps, "payload" | "forcePrompt"> & {
    forcePrompt?: boolean
  },
  resource: string,
  { body, ...rest }: Record<string, any> = {}
) => {
  const validation = await sign({
    forcePrompt: false,
    ...signProps,
    payload: body,
  })

  return fetcher(resource, { body, validation, ...rest })
}

const useFetcherWithSign = () => {
  const { account, chainId, provider } = useWeb3React<Web3Provider>()
  const { keyPair } = useKeyPair()
  const timeInaccuracy = useTimeInaccuracy()

  return (resource: string, { signOptions, ...options }: Record<string, any> = {}) =>
    fetcherWithSign(
      {
        address: account,
        chainId: chainId.toString(),
        provider,
        keyPair,
        ts: Date.now() + timeInaccuracy,
        ...signOptions,
      },
      resource,
      options
    )
}

export { fetcherWithSign, useFetcherWithSign }
export default fetcher
