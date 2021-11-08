const fetchApi = <T = any>(endpoint: string): Promise<T> =>
  fetch(`${process.env.NEXT_PUBLIC_API}${endpoint}`).then((response: Response) =>
    // response.ok ? response.json() : undefined
    response.json()
  )

export default fetchApi
