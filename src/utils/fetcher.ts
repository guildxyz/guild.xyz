import { datadogRum } from "@datadog/browser-rum"

const fetcher = async (
  resource: string,
  { body, validation, ...init }: Record<string, any> = {}
) => {
  const isGuildApiCall = !resource.startsWith("http") && !resource.startsWith("/api")

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

  if (isGuildApiCall)
    datadogRum?.addAction("FETCH", { url: `${api}${resource}`, options })

  return fetch(`${api}${resource}`, options).then(async (response: Response) => {
    const res = await response.json?.()

    if (!response.ok && isGuildApiCall)
      datadogRum?.addError("FETCH ERROR", {
        url: `${api}${resource}`,
        response: res,
      })

    return response.ok ? res : Promise.reject(res)
  })
}

export default fetcher
