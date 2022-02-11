const fetcher = (resource: string, init?) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""
  const options = init && {
    headers: { "Content-Type": "application/json" },
    ...init,
  }
  return fetch(`${api}${resource}`, options).then(async (response) =>
    response.ok ? response.json() : Promise.reject(response.json?.())
  )
}

export default fetcher
