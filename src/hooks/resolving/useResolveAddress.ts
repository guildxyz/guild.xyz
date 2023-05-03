import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chain, Chains } from "connectors"
import UNS_REGISTRY_ABI from "static/abis/unsRegistryAbi.json"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de"

type UnstoppableDomainsChains = Extract<
  Chain,
  "ETHEREUM" | "GOERLI" | "POLYGON" | "POLYGON_MUMBAI"
>
const UNSTOPPABLE_DOMAIN_CONTRACTS: Record<UnstoppableDomainsChains, string> = {
  ETHEREUM: "0x049aba7510f45ba5b64ea9e658e342f904db358d",
  GOERLI: "0x070e83fced225184e67c86302493fffcdb953f71",
  POLYGON: "0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f",
  POLYGON_MUMBAI: "0x2a93c52e7b6e7054870758e15a1446e769edfb93",
}

const fetchENSName = (
  provider: Web3Provider,
  address: string,
  chainId: number
): Promise<string> => {
  if (chainId !== Chains.ETHEREUM) return null
  provider.network.ensAddress = ENS_REGISTRY
  return provider.lookupAddress(address)
}

const fetchNNSName = async (
  provider: Web3Provider,
  account: string,
  chainId: number
): Promise<string> => {
  if (chainId !== Chains.ETHEREUM && chainId !== Chains.BSC) return null
  provider.network.ensAddress = NNS_REGISTRY
  return provider.lookupAddress(account)
}

const fetchLensProtocolName = (account: string): Promise<string> =>
  fetcher("https://api.lens.dev/", {
    method: "POST",
    body: {
      query: `query Profiles {
        profiles(request: { ownedBy: ["${account}"] }) {
          items {
            handle
        }}
      }`,
    },
  }).then((res) => res?.data?.profiles?.items?.[0]?.handle)

const fetchDotbitName = async (account: string): Promise<string> =>
  fetcher("https://indexer-v1.did.id/v1/reverse/record", {
    body: {
      type: "blockchain",
      key_info: {
        coin_type: "60", // 60: ETH, 195: TRX, 9006: BNB, 966: Matic
        chain_id: "1", // 1: ETH, 56: BSC, 137: Polygon
        key: account,
      },
    },
  }).then((res) => res.data.account)

const fetchUnstoppableName = async (
  provider: Web3Provider,
  account: string
): Promise<string> => {
  const chain = provider.network.chainId
  const contractAddress = UNSTOPPABLE_DOMAIN_CONTRACTS[Chains[chain]]

  if (!contractAddress) return null

  const contract = new Contract(contractAddress, UNS_REGISTRY_ABI, provider)
  return contract.reverseNameOf(account)
}

const useResolveAddress = (accountParam: string): string => {
  const { provider, chainId } = useWeb3React()
  const shouldFetch = Boolean(provider && accountParam)

  const fetchDomains = async (_: string, account: string, chainIdParam: number) => {
    // test address: 0xe5358cab95014e2306815743793f16c93a8a5c70
    const nns = await fetchNNSName(provider, account, chainIdParam)
    if (nns) return nns

    // test address: 0x5df52E6B70F25919Ad29add390EFE2614f91b2C6
    const ens = await fetchENSName(provider, account, chainIdParam)
    if (ens) return ens

    // test address: 0xe055721b972d58f0bcf6370c357879fb3a37d2f3
    const lens = await fetchLensProtocolName(account)
    if (lens) return lens

    // test address: 0x94ef5300cbc0aa600a821ccbc561b057e456ab23
    const unstoppableDomain = await fetchUnstoppableName(provider, account)
    if (unstoppableDomain) return unstoppableDomain

    // test address: 0x9176acd39a3a9ae99dcb3922757f8af4f94cdf3c
    const dotbit = await fetchDotbitName(account)
    if (dotbit) return dotbit

    return null
  }

  const { data } = useSWRImmutable(
    // Passing chainId in the dependency list, so we refetch the domains if the user switches chains
    shouldFetch ? ["domain", accountParam, chainId] : null,
    fetchDomains
  )

  return data
}

export default useResolveAddress
