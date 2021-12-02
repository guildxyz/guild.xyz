const fetcher = (resource: string, init?) => {
  const api =
    !resource.startsWith("http") && !resource.startsWith("/api")
      ? process.env.NEXT_PUBLIC_API
      : ""
  return fetch(`${api}${resource}`, init).then(async (response) =>
    response.ok ? response.json() : Promise.reject(response.json?.())
  )
}

export default fetcher
