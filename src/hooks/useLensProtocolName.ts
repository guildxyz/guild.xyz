import { ApolloClient, gql, InMemoryCache } from "@apollo/client"
import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const apolloClient = new ApolloClient({
  uri: "https://api.lens.dev/",
  cache: new InMemoryCache(),
})

const fetchLensProtocolName = (_, query) =>
  apolloClient
    .query({
      query: gql(query),
    })
    .then((res) => res.data.profiles.items[0].handle)
    .catch()

const useLensProtocolName = () => {
  const { account } = useWeb3React()
  const query = `
    query Profiles {
        profiles(request: { ownedBy: ["${account}"] }) {
            items {
            handle
        }}
    }`
  const shouldFetch = apolloClient ?? account
  const { data } = useSWRImmutable(
    shouldFetch ? ["lensProtocol", query] : null,
    fetchLensProtocolName
  )
  return data
}

export default useLensProtocolName

// test ownedBy: ["0xe055721b972d58f0bcf6370c357879fb3a37d2f3"]
