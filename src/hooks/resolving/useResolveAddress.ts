import Resolution from "@unstoppabledomains/resolution"
import { useWeb3React } from "@web3-react/core"
import { createInstance } from "dotbit"
import useSWRImmutable from "swr"
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
  dotbitResolver?.accountById(account)?.then((res) => res?.account)
// .catch((err) => err)

const fetchUnstoppableName = (resolver, account) =>
  resolver
    .reverse(account)
    .then((res) => res)
    .catch((err) => err) // why i need this?

const useResolveAddress = (account) => {
  const { provider } = useWeb3React()
  const shouldFetch = Boolean(provider && account)

  const fetchDomains = async () => {
    const NNS = await fetchNNSName(
      provider,
      "0xe5358cab95014e2306815743793f16c93a8a5c70"
    ) // "0xe5358cab95014e2306815743793f16c93a8a5c70"
    const ENS = await fetchENSName(provider, account) // "0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75"
    const lens = await fetchLensProtocolName(account) // "0xe055721b972d58f0bcf6370c357879fb3a37d2f3"
    const unstoppableResolver = new Resolution()
    const unstoppableDomain = await fetchUnstoppableName(
      unstoppableResolver,
      account
    ) // "0x94ef5300cbc0aa600a821ccbc561b057e456ab23"
    const dotbitResolver = createInstance()
    const dotbit = await fetchDotbitName(dotbitResolver, account) // "0x5728088435fb8788472a9ca601fbc0b9cbea8be3"

    return NNS || ENS || lens || unstoppableDomain || dotbit
  }

  const { data } = useSWRImmutable(shouldFetch ? ["domain"] : null, fetchDomains)

  return data
}

export default useResolveAddress
