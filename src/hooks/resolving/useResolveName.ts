import Resolution from "@unstoppabledomains/resolution"
import { useWeb3React } from "@web3-react/core"
import { createInstance } from "dotbit"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchENSName = (provider, address) => provider.lookupAddress(address)

const fetchNNSName = (provider, account) => {
  const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de"
  provider.network.ensAddress = NNS_REGISTRY
  return provider.lookupAddress(account)
}
const fetchLensProtocolName = (account) =>
  fetcher("https://api.lens.dev/", {
    method: "POST",
    body: {
      query: `
    query Profiles {
        profiles(request: { ownedBy: ["${account}"] }) {
            items {
            handle
        }}
    }`,
    },
  }).then((res) => res?.data?.profiles?.items?.[0]?.handle)

const fetchDotbitName = (dotbitResolver, account) =>
  dotbitResolver
    ?.accountById(account)
    ?.then((res) => res?.account)
    .catch((err) => console.log(err))

const fetchUnstoppableName = (resolver, account) =>
  resolver.reverse(account).then((res) => res)

const useResolveName = (account) => {
  const { provider } = useWeb3React()

  const fetchDomains = async () => {
    const NNS = fetchNNSName(provider, account) // "0xe5358cab95014e2306815743793f16c93a8a5c70"
    const ENS = fetchENSName(provider, account)
    const lens = fetchLensProtocolName(account) // "0xe055721b972d58f0bcf6370c357879fb3a37d2f3"
    const unstoppableResolver = new Resolution()
    const unstoppableDomain = fetchUnstoppableName(unstoppableResolver, account) // "0x94ef5300cbc0aa600a821ccbc561b057e456ab23"
    const dotbitResolver = createInstance()
    const dotbit = fetchDotbitName(dotbitResolver, account) // "0x5728088435fb8788472a9ca601fbc0b9cbea8be3"

    return NNS || ENS || lens || unstoppableDomain || dotbit // if one of there returns null, that'll be given back
  }

  const { data } = useSWRImmutable(["domain"], fetchDomains)

  return data
}

export default useResolveName
