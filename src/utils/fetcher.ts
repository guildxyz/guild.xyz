const fetcher = (resource: string, fetchOptions: Record<string, any> = {}) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""

  const options = fetchOptions && {
    ...fetchOptions,
    body: JSON.stringify(fetchOptions.body, fetchOptions.replacer),
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers ?? {}),
    },
  }
  return fetch(`${api}${resource}`, options).then(async (response) => {
    if (response.ok) {
      return response.json().catch(() => {})
    }

    Promise.reject(response.json())
  })
}

export default fetcher
