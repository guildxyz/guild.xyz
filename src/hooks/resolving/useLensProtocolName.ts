import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchLensProtocolName = (_, account) =>
  fetcher("https://api.lens.dev/", {
    method: "POST",
    body: {
      query: `
    query Profiles {
        profiles(request: { ownedBy: ["0xe055721b972d58f0bcf6370c357879fb3a37d2f3"] }) {
            items {
            handle
        }}
    }`,
    },
  }).then((res) => res.data.profiles.items[0].handle)

const useLensProtocolName = (account: string) => {
  const { data } = useSWRImmutable(
    account ? ["lensProtocol", account] : null,
    fetchLensProtocolName
  )

  return data
}

export default useLensProtocolName

// test ownedBy: ["0xe055721b972d58f0bcf6370c357879fb3a37d2f3"]
