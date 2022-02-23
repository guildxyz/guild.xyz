const fetcher = (resource: string, { body, ...init }: Record<string, any> = {}) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""

  const options = {
    ...(body
      ? {
          method: "POST",
          body: JSON.stringify(body, init.replacer),
        }
      : {}),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  }
  return fetch(`${api}${resource}`, options).then(async (response: Response) => {
    const res = response.json?.()

    if (!response.ok) {
      Promise.reject(res)
    }

    return res
  })
}

export default fetcher
