import { gql } from "@apollo/client"
import apolloClient from "pages/api/apolloClient"

const query = `
    query Profiles {
        profiles(request: { ownedBy: ["0xe055721b972d58f0bcf6370c357879fb3a37d2f3"], limit: 10 }) {
            items {
            handle
        }}
    }`

const useLensProtocolName = async () => {
  const response = await apolloClient.query({
    query: gql(query),
  })
  console.log(response.data.profiles.items[0].handle)
  return response.data.profiles.items[0].handle
}

export default useLensProtocolName
