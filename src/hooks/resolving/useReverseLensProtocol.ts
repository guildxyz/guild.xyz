import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchLensProtocolName = (_, domain) =>
  fetcher("https://api.lens.dev/", {
    method: "POST",
    body: {
      query: `
    query Profiles {
        profiles(request: { handles: ["${domain}"], limit: 1 }) {
            items {
            ownedBy
        }}
    }`,
    },
  }).then((res) => res.data.profiles.items[0].ownedBy)

const useReverseLensProtocol = (domain: string) => {
  const { data } = useSWRImmutable(
    domain ? ["lensProtocol", domain] : null,
    fetchLensProtocolName
  )

  return data
}

export default useReverseLensProtocol

// test domain: "ladidaix.lens"
// test address: ["0xe055721b972d58f0bcf6370c357879fb3a37d2f3"]
