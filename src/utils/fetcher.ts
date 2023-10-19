import { pushToIntercomSetting } from "components/_app/IntercomProvider"
import { useKeyPair } from "components/_app/KeyPairProvider"
import { sign } from "hooks/useSubmit"
import { SignProps } from "hooks/useSubmit/useSubmit"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi"

const SIG_HEADER_NAME = "x-guild-sig"
const PARAMS_HEADER_NAME = "x-guild-params"
const AUTH_FLAG_HEADER_NAME = "x-guild-auth-location"

const fetcher = async (
  resource: string,
  { body, validation, signedPayload, ...init }: Record<string, any> = {}
) => {
  const isGuildApiCall = !resource.startsWith("http") && !resource.startsWith("/api")

  const api = isGuildApiCall ? process.env.NEXT_PUBLIC_API : ""

  const options = {
    ...(body || signedPayload
      ? {
          method: "POST",
          body: JSON.stringify(
            validation
              ? {
                  payload: signedPayload,
                  ...validation,
                }
              : body
          ),
        }
      : {}),
    ...init,
    headers: {
      ...(body || signedPayload ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  }

  if (!!validation) {
    if (!options.method || options.method?.toUpperCase() === "GET") {
      delete options.body

      options.headers[PARAMS_HEADER_NAME] = Buffer.from(
        JSON.stringify(validation.params)
      ).toString("base64")

      options.headers[SIG_HEADER_NAME] = Buffer.from(validation.sig, "hex").toString(
        "base64"
      )

      options.headers[AUTH_FLAG_HEADER_NAME] = "header"
    } else {
      options.headers[AUTH_FLAG_HEADER_NAME] = "body"
    }
  }

  const endpoint = `${api}${resource}`.replace("/v1/v2/", "/v2/")

  return fetch(endpoint, options).then(async (response: Response) => {
    const res = await response.json?.()

    if (!response.ok) {
      if (
        res?.message === "Invalid or expired timestamp!" ||
        res?.message ===
          "Invalid timestamp! The creation of timestamp too far in future!"
      ) {
        window.localStorage.setItem("shouldFetchTimestamp", "true")
        location?.reload()
      }

      if (isGuildApiCall || resource.includes(process.env.NEXT_PUBLIC_API)) {
        const error = res.errors?.[0]

        const errorMsg = error
          ? `${error.msg}${error.param ? `: ${error.param}` : ""}`
          : res

        const correlationId = response.headers.get("X-Correlation-ID")
        if (correlationId) pushToIntercomSetting("correlationId", correlationId)

        // Some validators may return res.message, so we can't use res.errors.[0].msg in every case
        return Promise.reject({
          error: typeof errorMsg !== "string" ? errorMsg?.message : errorMsg,
          correlationId,
        })
      }

      return Promise.reject(res)
    }

    return res
  })
}

/**
 * In case of multiple parameters, SWR passes them as a single array now, so we
 * introduced this middleware function that spreads it for the original fetcher
 */
const fetcherForSWR = async (props: string | [string, Record<string, any>]) =>
  typeof props === "string" ? fetcher(props) : fetcher(...props)

const fetcherWithSign = async (
  signProps: Omit<SignProps, "payload" | "forcePrompt"> & {
    forcePrompt?: boolean
  },
  resource: string,
  { body = {}, ...rest }: Record<string, any> = {}
) => {
  const [signedPayload, validation] = await sign({
    forcePrompt: false,
    ...signProps,
    payload: JSON.stringify(body),
  })

  return fetcher(resource, { signedPayload, validation, ...rest })
}

const useFetcherWithSign = () => {
  const { keyPair } = useKeyPair()
  const timeInaccuracy = useTimeInaccuracy()

  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return (props) => {
    const [resource, { signOptions, ...options }] = props

    return fetcherWithSign(
      {
        address,
        chainId: chainId.toString(),
        publicClient,
        walletClient,
        keyPair,
        ts: Date.now() + timeInaccuracy,
        ...signOptions,
      },
      resource,
      options
    )
  }
}

export { fetcherForSWR, fetcherWithSign, useFetcherWithSign }
export default fetcher
