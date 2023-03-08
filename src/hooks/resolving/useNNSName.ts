import { Web3Provider } from "@ethersproject/providers"
import useSWRImmutable from "swr/immutable"

const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de"

const fetchNNSName = (_, provider, account) => {
  provider.network.ensAddress = NNS_REGISTRY
  return provider.lookupAddress("0xE5358CaB95014E2306815743793F16c93a8a5C70")
}

const useNNSName = (provider: Web3Provider, account: string): string => {
  const shouldFetch = Boolean(provider && account)

  const { data } = useSWRImmutable(
    shouldFetch ? ["NNS", provider, account] : null,
    fetchNNSName
  )

  return data
}

export default useNNSName

// test account address: "0xE5358CaB95014E2306815743793F16c93a8a5C70"
