const tryToStringify = (data: any) => {
  try {
    return JSON.stringify(data)
  } catch {
    return data
  }
}

const fetcher = (
  resource: string,
  { sessionToken, ...fetchOptions }: Record<string, any> = {
    sessionToken: undefined,
  }
) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""
  const options = (fetchOptions || sessionToken) && {
    ...fetchOptions,
    body: tryToStringify(fetchOptions.body),
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken ? { authorization: sessionToken } : {}), // TODO: Update this to send on proper format
      ...(fetchOptions.headers ?? {}),
    },
  }
  return fetch(`${api}${resource}`, options).then(async (response) =>
    response.ok ? response.json() : Promise.reject(response.json?.())
  )
}

export default fetcher
