import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { pushToIntercomSetting } from "components/_app/IntercomProvider"
import useKeyPair from "hooks/useKeyPair"
import { sign } from "hooks/useSubmit"
import { SignProps } from "hooks/useSubmit/useSubmit"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"

const SIG_HEADER_NAME = "x-guild-sig"
const PARAMS_HEADER_NAME = "x-guild-params"
const AUTH_FLAG_HEADER_NAME = "x-guild-auth-location"

const v2Replacer = (endpoint: string, options: Record<string, any>) => {
  // if (options.method?.toLowerCase() === "post" && endpoint.includes("/v1/guild")) {
  //   return endpoint.replace("/v1/guild", "/v2/guild/with-roles")
  // }
  // if (options.method?.toLowerCase() === "get" && endpoint.includes("/v1/guild/")) {
  //   return endpoint.replace("/v1/guild/", "/v2/guild/guild-page/")
  // }

  if (endpoint.startsWith(`${process.env.NEXT_PUBLIC_API}/guild?`)) {
    return endpoint.replace("/v1/", "/v2/").replace("/guild?", "/guilds?")
  }

  return endpoint
}

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

  const endpoint = isGuildApiCall
    ? v2Replacer(`${api}${resource}`, options)
    : `${api}${resource}`

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

      if (isGuildApiCall) {
        const error = res.errors?.[0]
        const errorMsg = error
          ? `${error.msg}${error.param ? ` : ${error.param}` : ""}`
          : res

        const correlationId = response.headers.get("X-Correlation-ID")
        if (correlationId) pushToIntercomSetting("correlationId", correlationId)

        return Promise.reject(errorMsg)
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
  { body, ...rest }: Record<string, any> = {}
) => {
  const [signedPayload, validation] = await sign({
    forcePrompt: false,
    ...signProps,
    payload: JSON.stringify(body),
  })

  return fetcher(resource, { signedPayload, validation, ...rest })
}

const useFetcherWithSign = () => {
  const { account, chainId, provider } = useWeb3React<Web3Provider>()
  const { keyPair } = useKeyPair()
  const timeInaccuracy = useTimeInaccuracy()

  return (props) => {
    const [resource, { signOptions, ...options }] = props
    return fetcherWithSign(
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
}

export { fetcherWithSign, useFetcherWithSign, fetcherForSWR }
export default fetcher
