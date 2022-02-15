import { mutate } from "swr"

const tryToStringify = (data: any) => {
  try {
    return JSON.stringify(data)
  } catch {
    return data
  }
}

const fetcher = (
  resource: string,
  fetchOptions: Record<string, any> = {},
  shouldRetryOnAuthError = true
) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""

  const options = fetchOptions && {
    ...fetchOptions,
    body: tryToStringify(fetchOptions.body),
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers ?? {}),
    },
  }
  return fetch(`${api}${resource}`, options).then(async (response) => {
    if (response.ok) {
      return response.json()
    } else if (shouldRetryOnAuthError && [402, 406].includes(response.status)) {
      await mutate("fetchSessionToken") // Should set a valid token cookie
      return fetcher(resource, fetchOptions, false)
    }

    Promise.reject(response.json())
  })
}

export default fetcher
