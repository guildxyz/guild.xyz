import { env } from "env"
import { FuelSignProps, SignProps } from "hooks/useSubmit/types"
import { fuelSign } from "hooks/useSubmit/utils"
import { sign } from "hooks/useSubmit/utils"
import { pushToIntercomSetting } from "./intercom"

const SIG_HEADER_NAME = "x-guild-sig"
const PARAMS_HEADER_NAME = "x-guild-params"
const AUTH_FLAG_HEADER_NAME = "x-guild-auth-location"

const fetcher = async (
  resource: string,
  { body, validation, signedPayload, ...init }: Record<string, any> = {}
) => {
  const isGuildApiCall = !resource.startsWith("http") && !resource.startsWith("/api")

  const api = isGuildApiCall ? env.NEXT_PUBLIC_API : ""

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
    const contentType = response.headers.get("content-type")
    const res = contentType.includes("json")
      ? await response.json?.()
      : await response.text()

    if (!response.ok) {
      if (
        res?.errors?.[0]?.msg === "Invalid or expired timestamp!" ||
        res?.errors?.[0]?.msg ===
          "Invalid timestamp! The creation of timestamp too far in future!"
      ) {
        window.localStorage.setItem("shouldFetchTimestamp", "true")
        location?.reload()
      }

      if (isGuildApiCall || resource.includes(env.NEXT_PUBLIC_API)) {
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

const fuelFetcherWithSign = async (
  signProps: Omit<FuelSignProps, "payload" | "forcePrompt"> & {
    forcePrompt?: boolean
  },
  resource: string,
  { body = {}, ...rest }: Record<string, any> = {}
) => {
  const [signedPayload, validation] = await fuelSign({
    forcePrompt: false,
    ...signProps,
    payload: JSON.stringify(body),
  })

  return fetcher(resource, { signedPayload, validation, ...rest })
}

export { fetcherForSWR, fetcherWithSign, fuelFetcherWithSign }
export default fetcher
