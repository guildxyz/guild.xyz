import useSWRImmutable from "swr/immutable"

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

const fetchProjects = () =>
  fetch("/api/juicebox", {
    method: "POST",
    body: JSON.stringify({
      query: QUERY,
    }),
  }).then((res) => res.json())

const useJuicebox = () => {
  const { isValidating, data } = useSWRImmutable<
    Array<{ id: string; uri: string; name: string; logoUri: string }>
  >("juicebox", fetchProjects)

  return { projects: data, isLoading: isValidating }
}

export default useJuicebox
