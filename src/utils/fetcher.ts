const tryToStringify = (data: any) => {
  try {
    return JSON.stringify(data)
  } catch {
    return data
  }
}

const fetcher = (resource: string, fetchOptions: Record<string, any> = {}) => {
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
  return fetch(`${api}${resource}`, options).then(async (response) =>
    response.ok ? response.json() : Promise.reject(response.json?.())
  )
}

export default fetcher
