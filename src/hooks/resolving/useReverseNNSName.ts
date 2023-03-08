import { Web3Provider } from "@ethersproject/providers"
import useSWRImmutable from "swr/immutable"

const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de"

const fetchNNSName = (_, provider, domain) => {
  provider.network.ensAddress = NNS_REGISTRY
  return provider.resolveName(domain)
}

const useReverseNNSName = (provider: Web3Provider, domain: string): string => {
  const shouldFetch = Boolean(provider && domain)

  const { data } = useSWRImmutable(
    shouldFetch ? ["NNS", provider, domain] : null,
    fetchNNSName
  )

  return data
}

export default useReverseNNSName
// test domain: "nnsregistry.⌐◨-◨"
// test account address: "0xE5358CaB95014E2306815743793F16c93a8a5C70"
