import useSWRImmutable from "swr/immutable"

type Data = {
  id: string
  uri: string
  name: string
  logoUri: string
}

const QUERY = `{
  projects(orderBy: totalPaid, orderDirection: desc) {
    id
    handle
    creator
    createdAt
    uri
    currentBalance
    totalPaid
    totalRedeemed
  }
}
`

const fetchOptions = {
  method: "POST",
  body: JSON.stringify({ query: QUERY }),
}

const useJuicebox = () => {
  const { data, isValidating } = useSWRImmutable<Data[]>([
    "/api/juicebox",
    fetchOptions,
  ])

  return { projects: data, isLoading: isValidating }
}

export default useJuicebox
