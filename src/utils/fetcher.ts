const fetcher = (resource, init?) =>
  fetch(resource, init).then(async (response) =>
    response.ok ? response.json() : Promise.reject(response.json?.())
  )

export default fetcher
