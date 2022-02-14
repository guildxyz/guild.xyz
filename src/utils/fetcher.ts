const tryToStringify = (data: any) => {
  try {
    return JSON.stringify(data)
  } catch {
    return data
  }
}

const fetcher = (
  resource: string,
  { authorization, ...fetchOptions }: Record<string, any> = {
    authorization: undefined,
  }
) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""
  const options = (fetchOptions || authorization) && {
    ...fetchOptions,
    body: tryToStringify(fetchOptions.body),
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { authorization } : {}),
      ...(fetchOptions.headers ?? {}),
    },
  }
  return fetch(`${api}${resource}`, options).then(async (response) =>
    response.ok ? response.json() : Promise.reject(response.json?.())
  )
}

export default fetcher
