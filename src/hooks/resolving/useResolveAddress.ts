import Resolution from "@unstoppabledomains/resolution"
import { useWeb3React } from "@web3-react/core"
import { createInstance } from "dotbit"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchENSName = (provider, address) => provider.lookupAddress(address)

const fetchNNSName = async (provider, account) => {
  const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de"
  const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  provider.network.ensAddress = NNS_REGISTRY
  const NNSDomain = await provider.lookupAddress(account)
  provider.network.ensAddress = ENS_REGISTRY
  return NNSDomain
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

const fetchDotbitName = (account) => {
  const dotbitResolver = createInstance()
  return dotbitResolver?.accountById(account)?.then((res) => res?.account)
}

const fetchUnstoppableName = (account) => {
  const unstoppableResolver = new Resolution()
  return unstoppableResolver.reverse(account)
}

const useResolveAddress = (account) => {
  const { provider } = useWeb3React()
  const shouldFetch = Boolean(provider && account)

  const fetchDomains = async () => {
    const NNS = await fetchNNSName(provider, account) // "test address: 0xe5358cab95014e2306815743793f16c93a8a5c70"
    if (NNS) return NNS

    const ENS = await fetchENSName(provider, account) // "test address: 0x5df52E6B70F25919Ad29add390EFE2614f91b2C6"
    if (ENS) return ENS

    const lens = await fetchLensProtocolName(account) // "test address: 0xe055721b972d58f0bcf6370c357879fb3a37d2f3"
    if (lens) return lens

    const unstoppableDomain = await fetchUnstoppableName(account) // "test address: 0x94ef5300cbc0aa600a821ccbc561b057e456ab23"
    if (unstoppableDomain) return unstoppableDomain

    const dotbit = await fetchDotbitName(account) // "test address: 0x5728088435fb8788472a9ca601fbc0b9cbea8be3"
    if (dotbit) return dotbit

    return null
  }

  const { data } = useSWRImmutable(shouldFetch ? ["domain"] : null, fetchDomains)

  return data
}

export default useResolveAddress
