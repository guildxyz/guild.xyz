const fetcher = async (
  resource: string,
  { body, validation, ...init }: Record<string, any> = {}
) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""

  const payload = body ?? {}

  const options = {
    ...(body
      ? {
          method: "POST",
          body: JSON.stringify(
            validation
              ? {
                  payload,
                  ...(validation ? { validation } : {}),
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

  return fetch(`${api}${resource}`, options).then(async (response: Response) => {
    const res = await response.json?.()

    return response.ok ? res : Promise.reject(res)
  })
}

export default fetcher
